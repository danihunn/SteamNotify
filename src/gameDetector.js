const { exec } = require('child_process')
const { log, errorLog} = require('./logger')
const { showAchievement } = require('./popup')

let lastAppId = null

function getRunningAppId(cb) {
    exec('reg query "HKEY_CURRENT_USER\\Software\\Valve\\Steam" /v RunningAppID', (err, stdout) => {
        if(err) return cb('0')
        const match = stdout.match(/RunningAppID\s+REG_DWORD\s+0x([0-9a-fA-F]+)/)
        const appId = match ? parseInt(match[1], 16).toString() : '0'
        cb(appId)
    })
}

function startGameDetection(onGameStart, onGameStop){
setInterval(() => {
    getRunningAppId((appId) => {
        if (appId !== '0' && appId !== lastAppId) {
            lastAppId = appId
            log(`[INFO] Game started ID: ${appId}`)
            onGameStart(appId)

            const gameStartPopup = {
                id: appId,
                name: `Game started`,
                description: appId,
                icon: ``,
                percentAchieved: ``
            }
            showAchievement(gameStartPopup, {duration: 5000 , volume: 0})
        }

        if (appId === '0' && lastAppId) {
            log(`[INFO] Game quit`)
            lastAppId = null
            onGameStop()
        }
    })
}, 3000);
}
module.exports = { startGameDetection }