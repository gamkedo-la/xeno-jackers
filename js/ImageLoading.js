//Image Loading
let shouldShowTitleImage = false;
let finishedLoading = false;
let splashScreenTime = 3000;
let blankScreenTime = 750;

function showTitleImage() {
    if(shouldShowTitleImage) {
        canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
        loadingDoneSoStartGame();
    } else {
        shouldShowTitleImage = true;
    }
    
}

//-----Load the HTGD Logo-----//
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

let htgdLogoScale = 1.0;

function animatedHTGDLogo() {
    function drawFirstBlank() {
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        if(DEBUG) blankScreenTime = 100;
        setTimeout(drawHTGDLogo, blankScreenTime); //blank screen for 0.75 seconds, then draw Logo
    }

    function drawHTGDLogo() {
        canvasContext.drawImage(gamkedoLogoPic, 0, 0, gamkedoLogoPic.width, gamkedoLogoPic.height, canvas.width / 2 - (htgdLogoScale * gamkedoLogoPic.width) / 2, canvas.height / 2 - (htgdLogoScale * gamkedoLogoPic.height) / 2, (htgdLogoScale * gamkedoLogoPic.width), (htgdLogoScale * gamkedoLogoPic.height));
        if(DEBUG) splashScreenTime = 100;
        setTimeout(drawSecondBlank, splashScreenTime); //HTGD Logo for 3.0 seconds, then draw blank
    }
    
    function drawSecondBlank() {
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        setTimeout(showTitleImage, blankScreenTime); //blank screen for 0.75 seconds, then go to Title
    }

    drawFirstBlank();
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
const tempGameSceneBG = document.createElement("img");

//characters
const bikerEnemySheet = document.createElement("img");
const bikerEnemy2Sheet = document.createElement("img");
const enemyAlienGuardSheet = document.createElement("img");
const enemyMechSpriteSheet = document.createElement("img");
const ufoSpriteSheet = document.createElement("img");
const enemyCrawlerSheet = document.createElement("img");
const enemyChunkyCrawlerSheet = document.createElement("img");
const enemyFlyerSheet = document.createElement("img");
const deathSheet = document.createElement("img");
    //bright sheets
let bikerEnemyBrightSheet;
let bikerEnemy2BrightSheet;
let enemyAlienGuardBrightSheet;
let enemyMechSpriteBrightSheet;
let enemyCrawlerBrightSheet;
let enemyChunkyCrawlerBrightSheet;
let enemyFlyerBrightSheet;

//screens
const uiMenuBorderPic = document.createElement("img");
const barBack = document.createElement("img");
const barBackBroke = document.createElement("img");
const barFront = document.createElement("img");
const barFrontBroke = document.createElement("img");

//environment objects
const lampPic = document.createElement("img");
const cactusFullPic = document.createElement("img");
const cutsceneTruck = document.createElement("img");

//power ups
const healthpickup = document.createElement("img");
const chainPickup = document.createElement("img");
const wheelPickup = document.createElement("img");
const handlebarPickup = document.createElement("img");
const handlebar = document.createElement("img");
const flyingFist = document.createElement("img");

//player related
const playerSpriteSheet = document.createElement("img");
    //player bright sheet
let playerBrightSheet;

//UI
const fontSheet = document.createElement("img");
const fontSheet2 = document.createElement("img");
const fontSheet3 = document.createElement("img");
const fontSheet4 = document.createElement("img");
const fontSheetStroke = document.createElement("img");
const fontSheetScore = document.createElement("img");
const fontSheetLives = document.createElement("img");
const offMenuButton = document.createElement("img");
const onMenuButton = document.createElement("img");
const statusbarBase = document.createElement("img");
const healthSegment = document.createElement("img");

let picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) { // last image loaded?
        const brightLight = new safeBrightImageBuilder();
        bikerEnemyBrightSheet = brightLight.imageForImage(bikerEnemySheet);
        bikerEnemy2BrightSheet = brightLight.imageForImage(bikerEnemy2Sheet);
        enemyAlienGuardBrightSheet = brightLight.imageForImage(enemyAlienGuardSheet);
        enemyMechSpriteBrightSheet = brightLight.imageForImage(enemyMechSpriteSheet);
        enemyCrawlerBrightSheet = brightLight.imageForImage(enemyCrawlerSheet);
        enemyChunkyCrawlerBrightSheet = brightLight.imageForImage(enemyChunkyCrawlerSheet);
        enemyFlyerBrightSheet = brightLight.imageForImage(enemyFlyerSheet);
        playerBrightSheet = brightLight.imageForImage(playerSpriteSheet);
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
        { imgName: tileSheet, theFile: "backgrounds/spritesheet_master.png" },
        { imgName: tempGameSceneBG, theFile: "backgrounds/background_test.png" },
        { imgName: barFront, theFile: "backgrounds/FinalDestination2.png" },
        { imgName: barBack, theFile: "backgrounds/FinalDestinationBack.png" },
        { imgName: barBackBroke, theFile: "backgrounds/FinalDestinationBackDamaged.png" },
        { imgName: barFrontBroke, theFile: "backgrounds/FinalDestinationFrontDamaged.png" },

        // characters
        { imgName: bikerEnemySheet, theFile: "characters/enemy_biker.png" },
        { imgName: bikerEnemy2Sheet, theFile: "characters/enemy_biker2.png" },
        { imgName: enemyAlienGuardSheet, theFile: "characters/enemy_alien_guard.png" },
        { imgName: enemyMechSpriteSheet, theFile: "characters/enemy_mech_spritesheet.png" },
        { imgName: enemyCrawlerSheet, theFile: "characters/enemy_crawler_spritesheet.png" },
        { imgName: enemyChunkyCrawlerSheet, theFile: "characters/enemy_chunkycrawler_spritesheet.png" },
        { imgName: enemyFlyerSheet, theFile: "characters/enemy_flyer_spritesheet.png" },
        { imgName: deathSheet, theFile: "characters/deathpoof.png" },
        { imgName: ufoSpriteSheet, theFile: "characters/ufo_spritesheet.png" },

        // screens
        { imgName: uiMenuBorderPic, theFile: "screens/screen_title_menu_border.png" },

        //environment objects
        { imgName: lampPic, theFile: "backgrounds/Lamp.png" },
        { imgName: cactusFullPic, theFile: "backgrounds/cactus_full.png" },
        { imgName: cutsceneTruck, theFile: "backgrounds/cutscenetruck.png" },

        // power ups
        { imgName: healthpickup, theFile: "interface/item_pickups.png" },
        { imgName: chainPickup, theFile: "interface/ChainPickUp.png" },
        { imgName: wheelPickup, theFile: "interface/WheelPickUp.png" },
        { imgName: handlebarPickup, theFile: "interface/HandlebarPickUp.png" },
        { imgName: handlebar, theFile: "interface/Handlebar.png" },
        { imgName: flyingFist, theFile: "interface/FlyingFist.png" },

        // player related
        { imgName: playerSpriteSheet, theFile: "characters/player_spritesheet.png" }, //player_spritesheet_debug.png

        // UI
        { imgName: fontSheet, theFile: "interface/xjfont.png" },
        { imgName: fontSheet2, theFile: "interface/xjfont2.png" },
        { imgName: fontSheet3, theFile: "interface/xjfont3.png" },
        { imgName: fontSheet4, theFile: "interface/xjfont4.png" },
        { imgName: fontSheetStroke, theFile: "interface/xjfont_stroke.png" },
        { imgName: fontSheetScore, theFile: "interface/xjfont_score.png" },
        { imgName: fontSheetLives, theFile: "interface/xjfont_lives.png" },
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