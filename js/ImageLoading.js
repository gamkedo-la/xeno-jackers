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

let htgdLogoScale = 0.5;
function animatedHTGDLogo() {
    
    drawRect(0, 0, canvas.width, canvas.height, '#252525');

    //Draw the Gamkedo Logo Image
    canvasContext.drawImage(gamkedoLogoPic, 0, 0, gamkedoLogoPic.width, gamkedoLogoPic.height, canvas.width/2 - (htgdLogoScale * gamkedoLogoPic.width)/2, canvas.height/2 - (htgdLogoScale * gamkedoLogoPic.height)/2, (htgdLogoScale * gamkedoLogoPic.width), (htgdLogoScale * gamkedoLogoPic.height));

    const nowTime = Date.now();
    if(nowTime - startTime < 1000) {
//        htgdLogoScale += 0.003125;//not animating it anymore.
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
//tiles
const tileSheet = document.createElement("img");
const tileSheetRock = document.createElement("img");
const tileSheetWorkshop = document.createElement("img");
const tempGameSceneBG = document.createElement("img");

//characters
const bikerEnemySheet = document.createElement("img");
const enemyAlienGuardSheet = document.createElement("img");

//screens
const uiMenuBorderPic = document.createElement("img");
const pauseScreenPic = document.createElement("img");

//power ups

//player related
const playerSpriteSheet = document.createElement("img");

//UI
const fontSheet = document.createElement("img");
const fontSheet2 = document.createElement("img");
const fontSheet3 = document.createElement("img");
const fontSheet4 = document.createElement("img");
const fontSheetStroke = document.createElement("img");
const offMenuButton = document.createElement("img");
const onMenuButton = document.createElement("img");
const statusbarBase = document.createElement("img");
const healthSegment = document.createElement("img");

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
        { imgName: tileSheet, theFile: "backgrounds/spritesheet_workshop.png" },
        { imgName: tileSheetRock, theFile: "backgrounds/spritesheet_grassyrock.png" },
        { imgName: tileSheetWorkshop, theFile: "backgrounds/spritesheet_workshop.png" },
        { imgName: tempGameSceneBG, theFile: "backgrounds/background_test.png" },

        // characters
        { imgName: bikerEnemySheet, theFile: "characters/enemy_biker.png" },
        { imgName: enemyAlienGuardSheet, theFile: "characters/enemy_alien_guard.png" },

        // screens
        { imgName: pauseScreenPic, theFile: "screens/screen_pause.png" },
        { imgName: uiMenuBorderPic, theFile: "screens/screen_title_menu_border.png" },

        // skyboxes
//        { imgName: workshopSkybox, theFile: "workshopSkybox.png" },

        // power ups
//        { imgName: shieldPowerUpPic, theFile: "shieldPowerUp.png" },

        // player related
        { imgName: playerSpriteSheet, theFile: "characters/player_spritesheet.png" },

        // UI
        { imgName: fontSheet, theFile: "interface/xjfont.png" },
        { imgName: fontSheet2, theFile: "interface/xjfont2.png" },
        { imgName: fontSheet3, theFile: "interface/xjfont3.png" },
        { imgName: fontSheet4, theFile: "interface/xjfont4.png" },
        { imgName: fontSheetStroke, theFile: "interface/xjfont_stroke.png" },
        { imgName: offMenuButton, theFile: "interface/menu_button_off.png" },
        { imgName: onMenuButton, theFile: "interface/menu_button_on.png" },
        { imgName: statusbarBase, theFile: "interface/statusbar_base.png" },
        { imgName: healthSegment, theFile: "interface/statusbar_health_segment.png" },
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages

function getSkyboxForName(name) {
    switch(name) {
        case "workshopSkybox.png":
            return workshopSkybox;
        default:
            return null;
    }
}