const TRAY_MENU_TOGGLE: &str = "tray_toggle";
const TRAY_MENU_SETTINGS: &str = "tray_settings";
const TRAY_MENU_QUIT: &str = "tray_quit";

use tauri_plugin_autostart::MacosLauncher;
use tauri::{Emitter, Manager, menu::{Menu, MenuItem}, tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState}, include_image};
use tauri_plugin_notification::NotificationExt;
use std::sync::Mutex;
use serde::Deserialize;

#[derive(Clone, Deserialize, Debug)]
pub struct Region {
    x: f64,
    y: f64,
    width: f64,
    height: f64,
}

pub struct InteractiveRegions(pub Mutex<Vec<Region>>);

#[tauri::command]
fn set_interactive_regions(regions: Vec<Region>, state: tauri::State<InteractiveRegions>) {
    if let Ok(mut lock) = state.0.lock() {
        *lock = regions;
    }
}

pub fn start_mouse_tracking<R: tauri::Runtime>(app: tauri::AppHandle<R>) {
    std::thread::spawn(move || {
        let mut was_inside = true; // Assume we are interactive on boot
        loop {
            std::thread::sleep(std::time::Duration::from_millis(50));

            if let Some(window) = app.get_webview_window("main") {
                if let Ok(cursor_pos) = app.cursor_position() {
                    if let Ok(window_pos) = window.outer_position() {
                        let rel_x = cursor_pos.x - window_pos.x as f64;
                        let rel_y = cursor_pos.y - window_pos.y as f64;

                        let mut is_inside = false;
                        
                        // Create an inner scope to quickly check and drop the lock
                        {
                            let state = app.state::<InteractiveRegions>();
                            if let Ok(regions) = state.0.lock() {
                                for r in regions.iter() {
                                    if rel_x >= r.x && rel_x <= r.x + r.width && rel_y >= r.y && rel_y <= r.y + r.height {
                                        is_inside = true;
                                        break;
                                    }
                                }
                            };
                        }

                        // Toggle behavior only when the state changes to avoid unnecessary OS calls
                        if is_inside != was_inside {
                            was_inside = is_inside;
                            let _ = window.set_ignore_cursor_events(!is_inside);
                        }
                    }
                }
            }
        }
    });
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn position_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(monitors) = app.available_monitors() {
            if let Some(monitor) = monitors.first() {
                let scale = monitor.scale_factor();
                let screen_w = monitor.size().width as f64 / scale;
                let screen_h = monitor.size().height as f64 / scale;

                let taskbar_h = 48.0;
                let work_area_h = screen_h - taskbar_h;

                let win_w = 360.0;
                let win_h = (work_area_h * 0.98).min(900.0);

                let _ = window.set_size(tauri::LogicalSize::new(win_w, win_h));
                let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize::new(win_w, win_h)));

                let margin = 12.0;
                let x = screen_w - win_w - margin;
                let y = (work_area_h - win_h) / 2.0;

                let _ = window.set_position(tauri::LogicalPosition::new(x, y));
                let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition::new(x, y)));
            }
        }
    }
}

#[tauri::command]
fn show_notification(app: tauri::AppHandle, title: &str, body: &str) {
    let _ = app.notification()
        .builder()
        .title(title)
        .body(body)
        .show();
}

#[tauri::command]
fn set_window_mode(app: tauri::AppHandle, mode: String) {
    if let Some(window) = app.get_webview_window("main") {
        if mode == "fullscreen" {
            let _ = window.set_resizable(true);
            let _ = window.maximize();
        } else {
            let _ = window.unmaximize();
            let _ = window.set_resizable(false);
            position_window(&app);
        }
    }
}

fn toggle_main_window<R: tauri::Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

#[cfg(target_os = "windows")]
fn create_tray(app: &tauri::App) -> tauri::Result<tauri::tray::TrayIcon> {
    let window = app.get_webview_window("main");
    let visible = window.as_ref().map(|w| w.is_visible().unwrap_or(true)).unwrap_or(true);
    let toggle_label = if visible { "Hide Widget" } else { "Show Widget" };

    let toggle = MenuItem::with_id(app, TRAY_MENU_TOGGLE, toggle_label, true, None::<&str>)?;
    let toggle_clone = toggle.clone();  // Clone for closure capture
    let settings = MenuItem::with_id(app, TRAY_MENU_SETTINGS, "Settings", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, TRAY_MENU_QUIT, "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&toggle, &settings, &quit])?;

    let tray = TrayIconBuilder::new()
        .icon(include_image!("icons/icon.ico"))
        .tooltip("Digital Muslim Widget")
        .menu(&menu)
        .on_menu_event(move |app_handle, event| {
            match event.id.as_ref() {
                TRAY_MENU_TOGGLE => {
                    toggle_main_window(&app_handle);
                    // Update label after toggle
                    if let Some(window) = app_handle.get_webview_window("main") {
                        if window.is_visible().unwrap_or(false) {
                            let _ = toggle_clone.set_text("Hide Widget");
                        } else {
                            let _ = toggle_clone.set_text("Show Widget");
                        }
                    }
                }
                TRAY_MENU_SETTINGS => {
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                    let _ = app_handle.emit("open-settings", ());
                }
                TRAY_MENU_QUIT => {
                    app_handle.exit(0);
                }
                _ => {}
            }
        })
        .on_tray_icon_event(move |tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event {
                toggle_main_window(&tray.app_handle());
            }
        })
        .build(app)?;

    Ok(tray)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(InteractiveRegions(Mutex::new(vec![
            Region { x: 0.0, y: 0.0, width: 99999.0, height: 99999.0 }
        ])))
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let handle = app.handle();

            // Set working directory for Windows task scheduler
            #[cfg(target_os = "windows")]
            {
                if let Ok(exe_path) = std::env::current_exe() {
                    if let Some(exe_dir) = exe_path.parent() {
                        let _ = std::env::set_current_dir(exe_dir);
                    }
                }
            }

            position_window(&handle);

            if let Some(window) = handle.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }

            #[cfg(target_os = "windows")]
            {
                let _tray: tauri::tray::TrayIcon= create_tray(app)?;
            }

            start_mouse_tracking(handle.clone());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            set_window_mode,
            set_interactive_regions,
            show_notification
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
