const { app, BrowserWindow } = require('electron');

const isDev = !app.isPackaged;

function log(message){
    if (isDev){
        // terminal log
        console.log(message);
    }

    // browser log
    const windows = BrowserWindow.getAllWindows()
    const win = windows.find(w => !w.isDestroyed() && w.webContents.getURL().includes('index.html'))
    if (win) {
        win.webContents.send('backend-log', message);
    }
}

function errorLog(message) {
    console.error(message);

    const windows = BrowserWindow.getAllWindows()
    const win = windows.find(w => !w.isDestroyed() && w.webContents.getURL().includes('index.html'))

    if (win) {
        win.webContents.send('backend-error', message);
    }
}

module.exports = { log, errorLog};