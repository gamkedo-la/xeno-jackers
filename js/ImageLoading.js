//Image Loading
let shouldShowTitleImage = false;
let finishedLoading = false;

function showTitleImage() {
    if(shouldShowTitleImage) {
        canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        loadingDoneSoStartGame();
    } else {
        shouldShowTitleImage = true;
    }
    
}

//-----Load the Gamkedo Logo-----//
const gamkedoLogoPic = document.createElement("img");
let startTime;
function loadGamkedoLogo() {
    gamkedoLogoPic.onload = function() {
        //Begin loading the Start Image
        loadStartImagePic();

        startTime = Date.now();
        animatedHTGDLogo();
    }
    
    gamkedoLogoPic.src = assetPath.Image + "screens/screen_HTGD_Logo_GB.png";
}

let htgdLogoScale = 2.0;
function animatedHTGDLogo() {
    
    drawRect(0, 0, canvas.width, canvas.height, '#252525');

    //Draw the Gamkedo Logo Image
    canvasContext.drawImage(gamkedoLogoPic, 0, 0, gamkedoLogoPic.width, gamkedoLogoPic.height, canvas.width/2 - (htgdLogoScale * gamkedoLogoPic.width)/2, canvas.height/2 - (htgdLogoScale * gamkedoLogoPic.height)/2, (htgdLogoScale * gamkedoLogoPic.width), (htgdLogoScale * gamkedoLogoPic.height));

    const nowTime = Date.now();
    if(nowTime - startTime < 1000) {
        htgdLogoScale += 0.0125;
        requestAnimationFrame(animatedHTGDLogo);
    } else {
        showTitleImage();
    }
}

//-----Load the title screen image-----//
const titleScreenPic = document.createElement("img");
function loadStartImagePic() {
    titleScreenPic.onload = function() {
        //Show the Start Image if ready
        showTitleImage();

        //Begin Loading remaining images
        loadImages();
    } 
    
    titleScreenPic.src = assetPath.Image + "screens/screen_title_base.png";
}

//-----Load the rest of the game images----//
const playerSpriteSheet = document.createElement("img");
const bikerEnemySheet = document.createElement("img");
const pauseScreenPic = document.createElement("img");
const tileSheet = document.createElement("img");
const fontSheet = document.createElement("img");
const uiMenuBorderPic = document.createElement("img");
const offMenuButton = document.createElement("img");
const onMenuButton = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) { // last image loaded?
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = assetPath.Image + fileName;
}

function loadImages() {
    const imageList = [
        // tiles
        { imgName: tileSheet, theFile: "backgrounds/spritesheet_grassyrock.png" },

        // characters
        { imgName: bikerEnemySheet, theFile: "characters/enemy_biker.png" },

        // screens
        { imgName: pauseScreenPic, theFile: "screens/screen_pause.png" },
        { imgName: uiMenuBorderPic, theFile: "screens/screen_title_menu_border.png" },

        // power ups
//        { imgName: shieldPowerUpPic, theFile: "shieldPowerUp.png" },

        // player related
        { imgName: playerSpriteSheet, theFile: "characters/player_spritesheet.png" },

        // UI
        { imgName: fontSheet, theFile: "interface/xjfont.png" },
        { imgName: offMenuButton, theFile: "interface/menu_button_off.png" },
        { imgName: onMenuButton, theFile: "interface/menu_button_on.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages