document.getElementById("quit-button").addEventListener("click", () => {
  window.app.quitApp()
});

document.getElementById("test-button").addEventListener("click", () => {
  window.app.testButton()
});

document.getElementById("tray-button").addEventListener('click', ()=> {
  window.app.minimizeToTray()
})

// logging
window.api.onLog((message) => {
  console.log(message);
});
window.api.onError((message) => {
  console.error(message);
});

const slider = document.getElementById("volume-slider");
const valueLabel = document.getElementById("volume-value");

slider.addEventListener("input", () => {
  window.app.setVolume(slider.value / 100);
});

// settings

// duration
const durationSlider = document.getElementById("duration-slider");
const durationValue = document.getElementById("duration-value");
durationSlider.addEventListener("input", () => {
  durationValue.textContent = durationSlider.value / 1000 + "s";
  window.app.setConfig({ duration: parseInt(durationSlider.value) });
});

// // width
// const widthSlider = document.getElementById("width-slider");
// const widthValue = document.getElementById("width-value");
// widthSlider.addEventListener("input", () => {
//   widthValue.textContent = widthSlider.value + "px";
//   window.app.setConfig({ width: parseInt(widthSlider.value) });
// });

// // height
// const heightSlider = document.getElementById("height-slider");
// const heightValue = document.getElementById("height-value");
// heightSlider.addEventListener("input", () => {
//   heightValue.textContent = heightSlider.value + "px";
//   window.app.setConfig({ height: parseInt(heightSlider.value) });
// });

// // margin
// const marginSlider = document.getElementById("margin-slider");
// const marginValue = document.getElementById("margin-value");
// marginSlider.addEventListener("input", () => {
//   marginValue.textContent = marginSlider.value + "px";
//   window.app.setConfig({ margin: parseInt(marginSlider.value) });
// });

// position
const cornerSelect = document.getElementById("corner-select");
cornerSelect.addEventListener("change", () => {
  window.app.setConfig({ corner: cornerSelect.value });
});