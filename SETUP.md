# React Tauri Desktop Widget - Setup Guide

## ✅ Current Status

**Your Islamic Prayer Times Widget is READY!** 🎉

All components have been implemented:
- ✅ Prayer widget UI with live clock
- ✅ Dark/Light mode theme switching
- ✅ Settings modal with location, theme, and Hijri adjustments
- ✅ Islamic quotes integration
- ✅ Gregorian to Hijri date conversion
- ✅ TypeScript type safety
- ✅ Responsive design
- ✅ localStorage persistence

### What You Get

```
My Prayer Widget:
├── Real-time prayer times display
├── Current time HH:MM:SS
├── Gregorian + Hijri calendar
├── Islamic quotes
├── Light/Dark theme (theme toggle in settings only)
├── Location settings
├── Hijri adjustment controls
└── Professional widget UI
```

## 🔧 Next Steps

### 1. Install Rust (Required for Desktop Build)

Rust is required to build the desktop application. Follow these steps:

**On Windows:**
1. Go to [https://rustup.rs](https://rustup.rs)
2. Download and run `rustup-init.exe`
3. Select option **1** for "Proceed with installation"
4. This will install Rust and Visual Studio Build Tools automatically
5. After installation, **restart your terminal**
6. Verify installation:
   ```bash
   rustc --version
   cargo --version
   ```

**On macOS:**
1. Go to [https://rustup.rs](https://rustup.rs)
2. Copy and paste the installation command in Terminal
3. Follow the prompts
4. After installation, **restart your terminal**
5. Verify installation:
   ```bash
   rustc --version
   cargo --version
   ```

**On Linux:**
1. Go to [https://rustup.rs](https://rustup.rs)
2. Copy and paste the installation command in Terminal
3. After installation, **restart your terminal**
4. Verify installation:
   ```bash
   rustc --version
   cargo --version
   ```

### 2. Start Development Mode

Once Rust is installed:

```bash
npm run dev
```

This command will:
- Start the Vite development server (hot reload enabled)
- Launch the Tauri application in development mode
- Show all debug information in the DevTools console

The app will open in a new desktop window.

### 3. Build for Production

When ready to create an installer:

```bash
npm run build
```

This creates:
- **Windows**: `.msi` installer and portable `.exe`
- **macOS**: `.dmg` installer and `.app` bundle
- **Linux**: `.deb` package and AppImage

Installers are available in: `src-tauri/target/release/bundle/`


## 📝 Project Configuration

### Key Files to Know:

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main React component |
| `src/App.css` | Component styles |
| `src-tauri/src/lib.rs` | Rust backend logic |
| `src-tauri/tauri.conf.json` | App configuration |
| `vite.config.ts` | Vite build settings |
| `package.json` | npm dependencies |

### Customize the Widget Window

Edit `src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "windows": [
      {
        "title": "My Widget",
        "width": 400,
        "height": 500,
        "resizable": false,
        "alwaysOnTop": true,
        "decorations": true
      }
    ]
  }
}
```

**Window Options:**
- `width`, `height`: Window dimensions in pixels
- `resizable`: Allow user to resize window
- `fullscreen`: Launch fullscreen
- `alwaysOnTop`: Keep window always on top
- `decorations`: Show window title bar and borders

## 💻 Development Workflow

### Hot Reload in Development

When you have a terminal running `npm run dev`:
1. Edit React components in `src/`
2. Changes appear instantly in the running app
3. No need to restart the Tauri app

### Call Rust from React

Example: Update `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Then call from React in `src/App.tsx`:

```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke<number>("add", { a: 5, b: 3 });
console.log(result); // 8
```

## 🐛 Common Issues

### "Rust not found" or "rustc not found"
- Run: `rustc --version`
- If command not found, install Rust from [rustup.rs](https://rustup.rs)
- **After installing, restart your terminal**

### Port 1420 already in use
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000  // Change to any available port
  }
})
```

### Build fails with "Cargo not found"
Windows users: Some antivirus software blocks the build process. Temporarily disable it or add the project folder to exclusions.

### DevTools not showing
- Only available in development (`npm run dev`)
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)

### Changes not appearing after npm run build
- Clean rebuild: `cargo clean` (in `src-tauri/` folder)
- Then: `npm run build`

## 📚 Useful Tauri APIs

Once the app is running, you can use these Tauri APIs:

```typescript
import { invoke } from "@tauri-apps/api/core";
import { window } from "@tauri-apps/api";

// Call Rust command
await invoke("command_name");

// Window operations
await window.getCurrent().minimize();
await window.getCurrent().maximize();
await window.getCurrent().close();

// Get app version
import { getVersion } from "@tauri-apps/api/app";
const version = await getVersion();
```

## 🚀 Ready to Build?

Your project is fully configured. Just need Rust installed!

```bash
# 1. Install Rust (if not already done)
# Visit https://rustup.rs

# 2. Start development
npm run dev

# 3. Open in browser (optional)
# Frontend runs on http://localhost:1420 (check Tauri window)
```

## 📖 More Resources

- [Tauri Documentation](https://tauri.app)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)

## ✨ What's Next?

After Rust is installed:

1. ✅ Run `npm run dev` to start developing
2. 🎨 Customize the React components in `src/`
3. ⚙️ Add Rust commands in `src-tauri/src/lib.rs`
4. 📦 Build with `npm run build` when ready to release

Enjoy building your desktop widget! 🎉
