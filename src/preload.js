const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
    quitApp: () => ipcRenderer.send("quit-app"),
    testButton: () => ipcRenderer.send("test-button"),
    button: () => ipcRenderer.send("button")
})

contextBridge.exposeInMainWorld('api', {
    onLog: (callback) => ipcRenderer.on('backend-log', (event, message) =>callback(message)),
    onError: (callback) => ipcRenderer.on('backend-error', (event, message) =>callback(message))
})
