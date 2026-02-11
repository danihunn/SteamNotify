const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const { log } = require("./logger");

const isDev = !app.isPackaged;
const steamId = null; // TODO: find steamID

if (isDev) {
  baseDir = path.join(__dirname, "..");
} else {
  baseDir = path.dirname(process.execPath);
}
log(`[INFO] isDev = ${isDev}\n`);
log(`[INFO] baseDir = ${baseDir}\n`);

// maybe better way to find steamPath ?
const possibleSteamPaths = [
  'C:\\Program Files\\Steam',
  'C:\\Program Files (x86)\\Steam',
  'C:\\Programs\\Steam'
]

const steamPath = possibleSteamPaths.find(path => fs.existsSync(path))
if (!steamPath) {
  throw new Error("Steam is not installed or couldn't find path")
}
log(`[INFO] steamPath: ${steamPath}`)