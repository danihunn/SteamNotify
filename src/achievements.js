const { app, ipcMain } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const { log, errorLog } = require("./logger");
const { configDotenv } = require("dotenv");

const templateENV =
  'steam_api_key="YOUR_STEAM_APIKEY_HERE"\nsteam_id="YOUR_STEAMID_HERE"';
const isDev = !app.isPackaged;

if (isDev) {
  basedir = path.join(__dirname, "..");
  envPath = path.join(basedir, ".env");
  // fs.writeFileSync(envPath, templateENV)
} else {
  basedir = path.dirname(process.execPath);
  envPath = path.join(basedir, ".env");
  if (!envPath) {
    fs.writeFileSync(envPath, templateENV);
    log(`[INFO] .env file created at: ${envPath}`);
  }
}

// create userData folder
// const folderPath = path.join(basedir, "userData");
// if (!fs.existsSync(folderPath)) {
//   fs.mkdirSync(folderPath, { recursive: true });
//   log(`[INFO] folder created at ${folderPath}`);
// } else {
//   log(`[INFO] folder already exists at ${folderPath}`);
// }

// load .env
configDotenv({ path: envPath });

const steam_api_key = process.env.steam_api_key;
const steam_id = process.env.steam_id;

async function getUserGames() {
  try {
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steam_api_key}&steamid=${steam_id}&format=json&include_appinfo=true`,
    );
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();

    const games = data.response.games.map((game) => ({
      appid: game.appid,
      gameName: game.name || "unknown",
      playTimeHours: (game.playtime_forever / 60).toFixed(2),
    }));
    log(games, { depth: null });

    // write to json
    const jsonData = JSON.stringify(games, null, 2);
    const dateNow = new Date()
      .toString()
      .replace(/GMT.*/, "")
      .replace(/\s/g, "")
      .replace(/:/g, "");
    if (isDev) {
      filePath = path.join(__dirname, "..", `steam_games_${dateNow}.json`);
    } else {
      filePath = path.join(process.execPath, `steam_games_${dateNow}.json`);
    }

    fs.writeFileSync(filePath, jsonData);
    log(`\n[INFO] File created at ${filePath}\n`);
  } catch (error) {
    errorLog(error);
  }
}

log(`\n[INFO] env path = ${envPath}`);
log(`[INFO] isDev = ${isDev}\n`);

ipcMain.on("test-button", () => {
  log("\n[INFO] test button pressed\n");
  getUserGames();
});


