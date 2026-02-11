const { app, BrowserWindow } = require('electron');

const isDev = !app.isPackaged;

function log(message){
    if (isDev){
        // terminal log
        console.log(message);
    }

    // browser log
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('backend-log', message);
    }
}

function errorLog(message) {
    console.error(message);

    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('backend-error', message);
    }
}

module.exports = { log, errorLog};