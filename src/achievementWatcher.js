const { ipcMain } = require("electron");
const fs = require("node:fs");
const path = require("node:path")
const { log, errorLog } = require("./logger");
const { showAchievement } = require('./popup')
const { startGameDetection } = require('./gameDetector')
const { steamPath, steamId } = require('./config')

// async function testAch() {
//     achievementList.forEach((ach) => {
//       log(`Name: ${ach.name}`);
//       log(`Desc: ${ach.description}`);
//       log(`Achieved by: ${ach.percentAchieved}`);
//       log(`Icon: ${ach.icon}\n`);
//     });
//   log(achievementList[0]);
// }

const LIBRARY_CACHE = path.join(steamPath,'userdata',steamId,'config','librarycache')

let lastUnlockedId = null
let currentWatchedFile = null
let newest = null

function parseAchievements(appId) {
  const filepath = path.join(LIBRARY_CACHE, `${appId}.json`)
  const raw = JSON.parse(fs.readFileSync(filepath,'utf8'))
  const achievementsEntry = raw.find(item => item[0] === 'achievements')
  if(!achievementsEntry) return []
  return achievementsEntry[1].data.vecHighlight.map(a => ({
    id: a.strID,
    name: a.strName,
    description: a.strDescription,
    icon: a.strImage,
    percentAchieved: a.flAchieved + '%',
  }))
}

function getAchievements(appId) {
  log(`[DEBUG] getAchievements called with appid ${appId}`)
  const filePath = path.join(LIBRARY_CACHE, `${appId}.json`)
  log(`[DEBUG] looking for file: ${filePath}`)
  log(`[DEBUG] file exists: ${fs.existsSync(filePath)}`)

  if(!fs.existsSync(filePath)) {
    errorLog(`[WARNING] No achievements found: ${filePath}`)
    return
  }
  if(currentWatchedFile) {
    fs.unwatchFile(currentWatchedFile)
    lastUnlockedId = null
  }

  currentWatchedFile = filePath

  try {
    const initial = parseAchievements(appId)
    if(initial.length > 0) {
      lastUnlockedName = initial[0].name
      lastUnlockedId = initial[0].id
      newest = initial[0]
    }
    log(`[INFO] Achievement watching started: ${appId}\n Last achievement: ${lastUnlockedName}\n filePath: ${filePath}`)
  } catch (e) {
    errorLog(`[WARNING] Initial loading failed: ${e.message}`)
  }

  // WORKS BUT DOESNT SHOW MULTIPLE POPUPS WHEN MORE ACHIEVEMENTS ARE GOT
//   fs.watchFile(filePath, { interval: 3000}, () => {
//     log(`[DEBUG] watchFile triggered at: ${filePath}`)
//     try {
//       const achievements = parseAchievements(appId)
//       if(achievements.length === 0) return

//       newest = achievements[0]

//       if(newest.id !== lastUnlockedId) {
//         log(`[INFO] New achievement: ${newest.name}`)
//         try {
//           showAchievement(newest)
//         } catch(e){
//           errorLog(`[ERROR] showAchievement failed: ${e.message}`)
//         }
//         lastUnlockedId = newest.id
//       }
//     } catch(e) {
//       errorLog(`[ERROR] watchFile error: ${e.message}`)
//     }
//   })
// }

  fs.watchFile(filePath, { interval: 1000}, () => {
    log(`[DEBUG] watchFile triggered at: ${filePath}`)
    try {
      const achievements = parseAchievements(appId)
      if(achievements.length === 0) return

      newest = achievements[0]

      if(achievements[0].id !== lastUnlockedId) {
        const lastIndex = achievements.findIndex(a => a.id === lastUnlockedId)
        const toShow = lastIndex === -1 ? [achievements[0]] : achievements.slice(0,lastIndex)

        toShow.forEach((ach, i) => {
          setTimeout(() => {
            log(`[INFO] New achievement: ${ach.name}`)
            showAchievement(ach)
          }, i * 500)
        })

        lastUnlockedId = achievements[0].id
      }
    } catch(e) {
      errorLog(`[ERROR] watchFile error: ${e.message}`)
    }
  })
}

function stopWatching() {
  if(currentWatchedFile) {
    fs.unwatchFile(currentWatchedFile)
    currentWatchedFile = null
    lastUnlockedId = null
    log(`[INFO] Achievement watching stopped`)
  }
}

startGameDetection(
  (appId) => getAchievements(appId),
  () => stopWatching()
)


ipcMain.on("button", () => {
  log("[INFO] button pressed " + process.execPath);
});

ipcMain.on("test-button", () => {
  // log("\n[INFO] test button pressed\n");
    showAchievement(newest)
});
