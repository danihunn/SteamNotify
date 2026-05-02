const {BrowserWindow, screen, ipcMain } = require("electron");
const path = require("node:path");
const { log, errorLog } = require("./logger");

const POPUP_CONFIG = {
  duration: 15000,

  width: 380,
  height: 100,

  corner: "middle-right",
  margin: 20,

  volume: 1
};

ipcMain.on('set-volume', (event, volume) => {
  POPUP_CONFIG.volume = parseFloat(volume)
})

ipcMain.on('set-config',(event,config) => {
  Object.assign(POPUP_CONFIG,config)
  log(`[INFO] Config updated: ${JSON.stringify(config)}`)
})

let notifWindows = [];

function getPosition(width, height, workArea) {
  const { width: sw, height: sh } = workArea;
  const m = POPUP_CONFIG.margin;

  switch (POPUP_CONFIG.corner) {
    case "bottom-right":
      return {
        x: sw - width - m,
        y: sh - height - m - notifWindows.length * (height + 10),
      };
    case "bottom-left":
      return { x: m, y: sh - height - m - notifWindows.length * (height + 10) };
    case "top-right":
      return { x: sw - width - m, y: m + notifWindows.length * (height + 10) };
    case "top-left":
      return { x: m, y: m + notifWindows.length * (height + 10) };
    case "middle-right":
      return { x: sw - width -m, y:Math.floor(sh/2)-Math.floor(height/2) - notifWindows.length * (height+10)}
    case "middle-left":
      return { x: m, y: Math.floor(sh/2) - Math.floor(height/2) - notifWindows.length * (height+10)}
    default:
      return { x: sw - width - m, y: sh - height - m };
  }
}

function showAchievement(achievement, options = {}) {
  console.log(`[DEBUG] showAchievement called, creating window...`)
  const workArea = screen.getPrimaryDisplay().workAreaSize
  const {x,y} = getPosition(POPUP_CONFIG.width, POPUP_CONFIG.height, workArea)

  const duration = options.duration ?? POPUP_CONFIG.duration
  const volume = options.volume ?? POPUP_CONFIG.volume

  const popup = new BrowserWindow({
    width: POPUP_CONFIG.width,
    height: POPUP_CONFIG.height,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    visibleOnAllWorkspaces: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  popup.setAlwaysOnTop(true,'screen-saver')
  popup.setVisibleOnAllWorkspaces(true)
  popup.showInactive()

  popup.loadFile("src/ui/notification.html");

  popup.webContents.on("did-finish-load", () => {
    log(`[DEBUG] popup loaded, sending achievement`)
    popup.webContents.send("achievement-unlocked",{ ...achievement,
    duration,
    corner: POPUP_CONFIG.corner,
    //sound:,
    volume,
    height: POPUP_CONFIG.height
  });
  });

  notifWindows.push(popup);

  setTimeout(() => {
    if (!popup.isDestroyed()) popup.close();
    notifWindows = notifWindows.filter((w) => w !== popup);
  }, POPUP_CONFIG.duration);
}

module.exports = { showAchievement };
