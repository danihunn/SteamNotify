const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
    quitApp: () => ipcRenderer.send("quit-app"),
    minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),
    testButton: () => ipcRenderer.send("test-button"),
    button: () => ipcRenderer.send("button"),
    setVolume: (volume) => ipcRenderer.send('set-volume', volume),
    setConfig: (config) => ipcRenderer.send('set-config',config)
})

contextBridge.exposeInMainWorld('api', {
    onLog: (callback) => ipcRenderer.on('backend-log', (event, message) =>callback(message)),
    onError: (callback) => ipcRenderer.on('backend-error', (event, message) =>callback(message))
})

// popup
contextBridge.exposeInMainWorld('notif', {
    onAchievementUnlocked: (cb) => ipcRenderer.on('achievement-unlocked', (event, data) => cb(data))
})