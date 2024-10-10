const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type = "range"]');
const currentHexes = document.querySelectorAll(".color h2");
const copyPopup = document.querySelector(".copy-contaniner");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
const sliderContainer = document.querySelectorAll(".sliders");
const lockButton = document.querySelectorAll(".lock");
let initialColor;
let savePalettes = [];
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

adjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustMentPanel(index);
  });
});

closeAdjustment.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockButton.forEach((lock, index) => {
  lock.addEventListener("click", (e) => {
    lockColor(e, index);
  });
});

copyPopup.addEventListener("click", (e) => {
  const popupBox = copyPopup.children[0];
  if (e.target.classList[0] === copyPopup.classList[0]) {
    popupBox.classList.remove("active");
    copyPopup.classList.remove("active");
  }
});
generateBtn.addEventListener("click", randomColors);
function randomColors() {
  initialColor = [];
  colorDivs.forEach((div, index) => {
    const buttons = div.children[1].querySelectorAll(".controls button");
    const hexText = div.children[0];
    const randomColor = generateHex();
    if (div.classList.contains("locked")) {
      initialColor.push(hexText.innerText);
      return;
    } else {
      initialColor.push(chroma(randomColor).hex());
    }
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    checkTextContrast(randomColor, hexText);
    buttons.forEach((button) => {
      checkTextContrast(randomColor, button);
    });
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInput();
}

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

function openAdjustMentPanel(index) {
  sliderContainer[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  sliderContainer[index].classList.toggle("active");
}

function lockColor(e, index) {
  const currentLock = e.target.children[0];

  const activeBg = colorDivs[index];
  activeBg.classList.toggle("locked");
  if (activeBg.classList.contains("locked")) {
    currentLock.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    currentLock.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);
saveContainer.addEventListener("click", (e) => {
  if (e.target === saveContainer) {
    closePalette(e);
  }
});
submitSave.addEventListener("click", savePalette);
function openPalette(e) {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.add("active");
  savePopup.classList.add("active");
}

function closePalette(e) {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  savePopup.classList.remove("active");
}

function savePalette() {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  savePopup.classList.remove("active");
  const paletteName = saveInput.value;
  if (paletteName === null) {
    return;
  }
  const color = [];
  currentHexes.forEach((hex) => {
    color.push(hex.innerText);
  });

  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savePalettes.length;
  }
  const paletteObj = {
    paletteName,
    color,
    paletteNr,
  };
  savePalettes.push(paletteObj);

  savetoLocal(paletteObj);
  saveInput.value = "";

  const libraryPalette = document.createElement("div");
  libraryPalette.classList.add("custom-palette");

  const title = document.createElement("h4");
  title.innerText = paletteObj.paletteName;

  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.color.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.paletteNr);
  paletteBtn.innerText = "Select";
  libraryPalette.appendChild(title);
  libraryPalette.appendChild(preview);
  libraryPalette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(libraryPalette);

  paletteBtn.addEventListener("click", (e) => {
    const paletteIndex = e.target.classList[1];
    console.log("paletteIndex", paletteIndex);
    initialColor = [];
    console.log(savePalettes[paletteIndex]);
    savePalettes[paletteIndex].color.forEach((color, index) => {
      initialColor.push(color);
      colorDivs[index].style.backgroundColor = color;
      const slider = colorDivs[index].querySelectorAll(".sliders input");
      const hue = slider[0];
      const brightness = slider[1];
      const saturation = slider[2];
      const paletteColor = chroma(color);
      colorizeSliders(paletteColor, hue, brightness, saturation);
      checkTextContrast(color, currentHexes[index]);
      updateTextUI(index);
    });
    resetInput();
  });
}

function savetoLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getLocal() {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savePalettes = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      const libraryPalette = document.createElement("div");
      libraryPalette.classList.add("custom-palette");

      const title = document.createElement("h4");
      title.innerText = paletteObj.paletteName;

      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.color.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.paletteNr);
      paletteBtn.innerText = "Select";
      libraryPalette.appendChild(title);
      libraryPalette.appendChild(preview);
      libraryPalette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(libraryPalette);
      paletteBtn.addEventListener("click", (e) => {
        initialColor = [];
        paletteObj.color.forEach((color, index) => {
          initialColor.push(color);
          colorDivs[index].style.backgroundColor = color;
          const slider = colorDivs[index].querySelectorAll(".sliders input");
          const hue = slider[0];
          const brightness = slider[1];
          const saturation = slider[2];
          const paletteColor = chroma(color);
          colorizeSliders(paletteColor, hue, brightness, saturation);
          checkTextContrast(color, currentHexes[index]);
          updateTextUI(index);
        });
        resetInput();
      });
    });
  }
}

function openLibrary(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
  libraryContainer.addEventListener("click", (e) => {
    if (e.target === libraryContainer) {
      closeLibrary();
    }
  });
}
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

getLocal();
randomColors();
