const { app, BrowserWindow, session, shell, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#090d0d',
    title: 'CRT TV Browser',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = new Set(['fullscreen', 'media', 'clipboard-read', 'clipboard-sanitized-write']);
    callback(allowed.has(permission));
  });

  session.defaultSession.on('will-download', (_event, item) => {
    // Electron's native download manager handles progress and saves to Downloads.
    item.setSaveDialogOptions({ title: 'Save download' });
  });

  ipcMain.handle('crt:open-external', async (_event, rawUrl) => {
    try {
      const url = new URL(rawUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
      await shell.openExternal(url.toString());
      return true;
    } catch {
      return false;
    }
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
