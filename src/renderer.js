document.getElementById('quit-button').addEventListener('click', () => {
    window.app.quitApp()
})

document.getElementById('test-button').addEventListener('click', () => {
    window.app.testButton()
})

document.getElementById('button').addEventListener('click', () => {
    window.app.button()
})

// logging
window.api.onLog((message) => {
    console.log(message)
})
window.api.onError((message) => {
    console.error(message);
})