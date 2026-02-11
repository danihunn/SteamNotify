const { ipcMain } = require("electron");
const fs = require("node:fs");
const { log, errorLog } = require("./logger");

// async function testAch() {
//     achievementList.forEach((ach) => {
//       log(`Name: ${ach.name}`);
//       log(`Desc: ${ach.description}`);
//       log(`Achieved by: ${ach.percentAchieved}`);
//       log(`Icon: ${ach.icon}\n`);
//     });
//   log(achievementList[0]);
// }

fs.watchFile("./testAchievements.json", (eventType, filename) => {
  
  const data = JSON.parse(fs.readFileSync("./testAchievements.json", "utf8"));
  const achievementMap = data.find((item) => item[0] === "achievementmap");
  const achievementData = JSON.parse(achievementMap[1].data);
  const achievements = achievementData[0][1];

  const achievementList = achievements.map(([id, achievement]) => ({
    name: achievement.strName,
    description: achievement.strDescription,
    percentAchieved: achievement.flAchieved + "%",
    icon: achievement.strImage,
  }));
  
  log(achievementList[0]);
});

ipcMain.on("button", () => {
  log("[INFO] button pressed " + process.execPath);
});

ipcMain.on("test-button", () => {
  log("\n[INFO] test button pressed\n");
});
