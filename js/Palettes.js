// a way to tint the sprite palettes
// for gameboy green optional mode etc


var paletteNames = ["GREY","GAMEBOY","CHILL","SEPIA","LILAC","LAVA"]
var paletteRGBA = [
    "",
    "rgba(0,255,0,0.1)",
    "rgba(0,255,255,0.1)",
    "rgba(255,200,150,0.1)",
    "rgba(255,0,255,0.1)",
    "rgba(255,0,0,0.1)",
];

var paletteNum = 0;
var paletteString = paletteNames[paletteNum];

function nextPallete() {
    paletteNum++;
    if (paletteNum>paletteNames.length-1) paletteNum=0;
    paletteString = paletteNames[paletteNum];
    console.log('Next palette: '+paletteString);
}
function prevPallete() {
    paletteNum--;
    if (paletteNum<0) paletteNum = paletteNames.length-1;
    paletteString = paletteNames[paletteNum];
    console.log('Prev palette: '+paletteString);
}

function drawPaletteEffect() {
    
    if (paletteNum==0) return; // normal greyscale graphics: do nothing

    // draw a colour overlay to tint the existing greyscale image
    drawRect(0,0,canvas.width,canvas.height,paletteRGBA[paletteNum]);
}
