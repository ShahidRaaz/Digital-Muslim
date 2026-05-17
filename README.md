# Digital Muslim Desktop Widget

A modern desktop widget application built with React, TypeScript, and Tauri. This project demonstrates how to create a lightweight, performant desktop application using web technologies.

## 📋 Project Structure

```
├── src/                          # React frontend source code
│   ├── App.tsx                   # Main React component
│   ├── App.css                   # Styling
│   ├── main.tsx                  # Entry point
│   ├── assets/                   # Static assets
│   └── vite-env.d.ts            # Vite environment types
├── src-tauri/                    # Rust backend source code
│   ├── src/                      # Rust source files
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri app configuration
├── public/                       # Public assets
├── package.json                  # Node.js dependencies
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
└── index.html                   # HTML entry point
```

## 🚀 Prerequisites

Before getting started, ensure you have the following installed:

1. **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org)
2. **Rust** - Required for building the Tauri desktop app
   - Download from [rustup.rs](https://rustup.rs)
   - On Windows, follow the installation instructions, which will also install Visual Studio Build Tools
3. **Visual Studio Build Tools** (Windows only) - Required for Rust compilation
   - Install as part of Rust setup, or download separately from [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)

### Verify Installation

```bash
node --version        # Should be v16+
npm --version         # Should be v7+
rustc --version       # Should show Rust version
cargo --version       # Should show Cargo version
```

## 📦 Installation

All npm dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## 🏗️ Project Setup

### 1. Update Project Name and Identifier (Optional)

Edit `src-tauri/tauri.conf.json`:

```json
{
  "productName": "Digital Muslim Widget",
  "identifier": "com.digital-muslim.widget",
  ...
}
```

### 2. Configure Window Properties

In `src-tauri/tauri.conf.json`, you can customize the window:

```json
{
  "windows": [
    {
      "title": "Digital Muslim Widget",
      "width": 400,
      "height": 500,
      "resizable": true,
      "fullscreen": false,
      "alwaysOnTop": true
    }
  ]
}
```

## 🛠️ Development

### Start Development Server

```bash
npm run dev
```

This will:
1. Start the Vite dev server (frontend)
2. Launch the Tauri application in development mode
3. Enable hot module replacement for instant code updates

The application will open in a desktop window with developer tools enabled.

### Build for Production

```bash
npm run build
```

This will:
1. Compile TypeScript
2. Build the React application
3. Bundle assets
4. Create platform-specific installers in `src-tauri/target/release/bundle/`

### Preview Production Build

```bash
npm run preview
```

## 🔧 Tauri Commands

Run Tauri-specific commands:

```bash
npm run tauri dev          # Start development
npm run tauri build        # Build for production
npm run tauri android init # Initialize Android support (optional)
```

## 📱 Widget Customization

### Modify the React App

The main application component is located in `src/App.tsx`. Edit this file to customize the widget appearance and functionality.

### Styling

- CSS files are in `src/` directory
- Vite supports importing CSS directly in components
- Modify `src/App.css` to change the default styles

### Using Tauri APIs

The `@tauri-apps/api` package is already installed. Use it to:

- Access system information
- Manage window operations
- Trigger custom Rust commands
- Handle file operations

Example:

```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke('your_command', { param: 'value' });
```

## 🐍 Rust Backend (Optional)

To extend functionality with Rust commands:

1. Edit `src-tauri/src/main.rs`
2. Define Tauri commands
3. Call them from React using the Tauri API

Example command in `main.rs`:

```rust
#[tauri::command]
fn my_custom_command(input: String) -> String {
    format!("Hello from Rust: {}", input)
}
```

## 🎯 Key Technologies

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tauri 2** - Desktop application framework
- **Vite** - Modern build tool
- **Rust** - High-performance backend

## 📦 Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run tauri dev` | Run in development mode |
| `npm run tauri build` | Build application |

## 🐛 Troubleshooting

### Rust Not Found
- Ensure Rust is installed: `rustc --version`
- Restart your terminal after installing Rust
- On Windows, install Visual Studio Build Tools

### Port Already in Use
- The dev server uses port 1420 by default
- If busy, edit `vite.config.ts` to change the port

### Build Fails
- Clean the Rust build: `rm -rf src-tauri/target` (or use Windows Explorer)
- Rebuild: `npm run build`

### Hot Reload Not Working
- Ensure Vite dev server is running
- Check that `devUrl` in `tauri.conf.json` is `http://localhost:1420`

## 📚 Resources

- [Tauri Documentation](https://tauri.app)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)

## 📄 License

This project is provided as-is for educational and development purposes.

## 🤝 Support

For issues with:
- **Tauri**: See [Tauri GitHub Issues](https://github.com/tauri-apps/tauri/issues)
- **React**: See [React Discord](https://discord.gg/react)
- **Rust**: See [Rust Forum](https://users.rust-lang.org)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
