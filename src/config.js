const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const { log } = require("./logger");

const isDev = !app.isPackaged;

if (isDev) {
  baseDir = path.join(__dirname, "..");
} else {
  baseDir = path.dirname(process.execPath);
}
log(`[INFO] isDev = ${isDev}\n`);
log(`[INFO] baseDir = ${baseDir}\n`);

// TODO: better way to find steamPath
const possibleSteamPaths = [
  'C:\\Program Files\\Steam',
  'C:\\Program Files (x86)\\Steam',
  'C:\\Programs\\Steam'
]

const steamPath = possibleSteamPaths.find(path => fs.existsSync(path))
if (!steamPath) {
  throw new Error("Steam is not installed or couldn't find path")
}
log(`[INFO] steamPath: ${steamPath}`);

const steamIdFolder = path.join(steamPath, 'userdata');
const userDataFolders = fs.readdirSync(steamIdFolder, {withFileTypes: true});
const steamId = userDataFolders.find(f => f.isDirectory() && /^\d+$/.test(f.name) && f.name !== '0')?.name;

log(`[INFO] steamId: ${steamId}`);
