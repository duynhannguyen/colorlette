const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHexes = document.querySelectorAll(".color h2");
const copyPopup = document.querySelector(".copy-contaniner");
let initialColor;
function generateHex() {
  const hexColor = chroma.random();

  return hexColor;
}

let randomHex = generateHex();

sliders.forEach((slider, index) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipBoarb(hex);
  });
});

copyPopup.addEventListener("click", (e) => {
  const popupBox = copyPopup.children[0];
  if (e.target.classList[0] === copyPopup.classList[0]) {
    popupBox.classList.add("closing");
    popupBox.classList.remove("active");
    copyPopup.classList.remove("active");
    popupBox.classList.remove("closing");
  }
});

function randomColors() {
  initialColor = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    initialColor.push(chroma(randomColor).hex());
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    checkTextContrast(randomColor, hexText);
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInput();
}

randomColors();
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}
function colorizeSliders(color, hue, brightness, saturation) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, fullSat]);
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)} ,${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75) , rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75) )`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-saturation");
  let sliders = e.target.parentElement.querySelectorAll(
    'input[type = "range"]'
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColor[index];
  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);
  colorDivs[index].style.backgroundColor = color;
  colorizeSliders(color, hue, brightness, saturation);
}
function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button ");
  textHex.innerText = color.hex();
  checkTextContrast(color, textHex);
  icons.forEach((icon) => {
    checkTextContrast(color, icon);
  });
}

function resetInput() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    switch (slider.name) {
      case "hue":
        const hueColor = initialColor[slider.getAttribute("data-hue")];
        const hueValue = chroma(hueColor).hsl()[0];
        slider.value = Math.floor(hueValue);
        break;
      case "brightness":
        const brightColor = initialColor[slider.getAttribute("data-bright")];
        const brightValue = chroma(brightColor).hsl()[2];
        slider.value = Math.floor(brightValue * 100) / 100;
        break;
      case "saturation":
        const satColor = initialColor[slider.getAttribute("data-saturation")];
        const satValue = chroma(satColor).hsl()[1];
        slider.value = Math.floor(satValue * 100) / 100;
        break;
    }
  });
}
function copyToClipBoarb(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  const popup = copyPopup.classList.add("active");
  copyPopup.children[0].classList.add("active");
}
