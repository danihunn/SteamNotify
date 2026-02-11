const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const { log, errorLog } = require("./logger");


process.on("uncaughtException", (err) => {
  errorLog(`[FATAL] Uncaught Exception: ${err}`);
  app.quit();
  process.exit(1);
});

require("./config");
require("./achievementData");

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
      height: 800,
      width: 600,
      minHeight: 800,
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
