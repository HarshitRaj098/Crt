# CRT TV Browser — Windows desktop edition

This is a separate Electron desktop app in the existing repository. It does not replace the static Vercel website.

## Requirements
- Windows 10/11 x64
- Node.js 20 or newer
- Internet access for installing dependencies

## Run in development
```bash
npm install
npm start
```

## Build the Windows installer
```bash
npm run dist
```

The installer is written to `release/`. Install it like a normal Windows app.

## Browser features
- Chromium engine through Electron's webview
- URL navigation and search queries (Google Search)
- Back, forward, reload, home, and open in the default browser
- Multiple tabs
- Persistent browser session partition for cookies and logins
- Electron download handling
- CRT chassis, scanlines, and signal overlay
- Keyboard shortcuts: Ctrl+L address bar, Ctrl+T new tab, Ctrl+W close tab

## Security notes
Website content runs in a separate Chromium guest context with Node integration disabled and web security enabled. Only HTTP, HTTPS, and file URLs are accepted by the address bar. Electron's permission handler only grants a small set of browser permissions. Review permission behavior before distributing broadly.

## Project layout
- `index.html`: existing Vercel web preview; left intact
- `desktop/index.html`: desktop CRT browser UI
- `desktop/main.cjs`: Electron main process
- `desktop/preload.cjs`: minimal context-isolated bridge
