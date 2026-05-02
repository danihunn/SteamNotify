const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } = require("electron");
const path = require("node:path");

const { log, errorLog } = require("./logger");

let tray = null

process.on("uncaughtException", (err) => {
  errorLog(`[FATAL] Uncaught Exception: ${err}`);
  app.quit();
  process.exit(1);
});

require("./config");
require("./achievementWatcher");
require("./popup")
require('./gameDetector')

ipcMain.on("quit-app", () => {
  app.quit();
});

// main window config
const createWindow = () => {
  try {
    const win = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      height: 400,
      width: 600,
      minHeight: 400,
      minWidth: 600,
      roundedCorners: true,
      frame: false,
      transparent: true,
      center: true,
      backgroundMaterial: "acrylic",
    });
    win.loadFile("src/ui/index.html").catch(err => {
        errorLog(`[FATAL] app failed to load ${err}`);
        app.quit()
        process.exit(1)
    });

    ipcMain.on('minimize-to-tray', ()=>{
  win.hide()
  if (!tray) {
    // const iconPath = path.join(__dirname, 'img', 'trayIcon.png')
    // const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(`C:\\Users\\balin\\Desktop\\Coding\\SteamNotify\\img\\trayIcon.ico`)

    tray.setToolTip('SteamNotify')

    const contextMenu = Menu.buildFromTemplate([
      {label: 'Open', click: () => win.show()},
      {label: 'Quit', click: () => app.quit()}
    ])
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      win.show()
    })
  }
})

  } catch (err) {
    errorLog(`[FATAL] couldn't draw window: ${err}`);
    app.quit();
    process.exit(1);
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  })
  .catch((err) => {
    errorLog(`[FATAL] app failed to load ${err}`);
    app.quit();
    process.exit(1);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
