// a way to tint the sprite palettes
// for gameboy green optional mode etc


const paletteNames = ["STEEL", "GAMEBOY", "CHILL", "SEPIA", "LILAC", "LAVA", "OCEAN"]
const paletteRGBA = [
    "",
    "rgba(0,255,0,0.1)",
    "rgba(0,255,255,0.1)",
    "rgba(112, 66, 20,0.2)",
    "rgba(255,0,255,0.1)",
    "rgba(255,0,0,0.1)",
    "rgba(0,0,255,0.1)",
];

let paletteNum = 0;
let paletteString = paletteNames[paletteNum];

function nextPallete() {
    paletteNum++;
    if (paletteNum > paletteNames.length - 1) paletteNum = 0;
    paletteString = paletteNames[paletteNum];
}
function prevPallete() {
    paletteNum--;
    if (paletteNum < 0) paletteNum = paletteNames.length - 1;
    paletteString = paletteNames[paletteNum];
}

function drawPaletteEffect() {
    if (paletteNum === 0) return; // normal greyscale graphics: do nothing

    // draw a colour overlay to tint the existing greyscale image
    drawRect(0, 0, canvas.width, canvas.height, paletteRGBA[paletteNum]);
}
