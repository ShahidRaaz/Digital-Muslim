// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Set the current directory to the executable's parent directory
    if let Ok(mut exe_path) = std::env::current_exe() {
        exe_path.pop(); // Remove the executable's filename
        if let Err(e) = std::env::set_current_dir(&exe_path) {
            // Log or handle the error if changing the directory fails
            eprintln!("Failed to set current directory: {}", e);
        }
    }

    app_lib::run();
}
