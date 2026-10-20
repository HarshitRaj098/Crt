const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('crtApp', Object.freeze({
  platform: process.platform,
  version: process.versions.electron,
  openExternal: (url) => ipcRenderer.invoke('crt:open-external', String(url))
}));
