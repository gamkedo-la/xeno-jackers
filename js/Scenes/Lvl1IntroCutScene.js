//Lvl1IntroCutScene.js
function Lvl1IntroCutScene() {
    let cutScenePlayer;
    let titlePos = 20;
    let ufo = null;
    let ufoPosition = {x: 0, y: 20};
    let ufoTurnedAround = false;
    let ufoExiting = false;
    const ufoStallPosition = 100;
    let ufoStallTime = 1500;
    let ufoIsStalled = false;
    let laserColors = ['#A2E7E5', '#A9E5F8', '#BFF8E3', '#A2E7E5', '#A9E5F8', '#BFF8E3', '#A2E7E5', '#A9E5F8', '#BFF8E3'];
    let laserColorIndex = 0;
    let laserWidth = 0;
    let laserHeight = 0;
    let barBackImage = barBack;
    let barFrontImage = barFront;

    this.transitionIn = function() {
        cutScenePlayer = new CutScenePlayer(0, 108);
        ufo = new SpriteAnimation('idle', ufoSpriteSheet, [0, 1, 2, 3], 50, 26, [360], false, true);
        const titleWidth = fontRenderer.getWidthOfText("THE BAR", 1, FONT.Stroked);
        titlePos = Math.round((canvas.width - titleWidth) / 2);
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    };

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        switch (newKeyEvent) {
            case ALIAS.SELECT1:
            case ALIAS.SELECT2:
            case ALIAS.POINTER:
                SceneState.setState(SCENE.GAME);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        cutScenePlayer.update(deltaTime);
        ufo.update(deltaTime);

        if((ufoPosition.x < ufoStallPosition) && (!ufoTurnedAround)) {
            ufoPosition.x++;
        } else if((ufoPosition.x >= ufoStallPosition) && (ufoStallTime > 0)) {
            ufoStallTime -= deltaTime;
            calculateLaserDimensions();
            ufoIsStalled = true;
            laserColorIndex = (laserColorIndex + 2) % 9;
            barBackImage = barBackBroke;
            barFrontImage = barFrontBroke;
        } else if((ufoPosition.x >= ufoStallPosition) && (!ufoTurnedAround)) {
            ufoPosition.x--;
            ufoTurnedAround = true;
            ufoIsStalled = false;
        } else if((ufoPosition.x > 50) && (!ufoExiting)) {
            ufoPosition.x--;
        } else if((ufoPosition.x <= 50) && (!ufoExiting)) {
            ufoExiting = true;
            ufoPosition.x += 3;
        } else {
            ufoPosition.x += 3;
        }

        if (ufoPosition.x > canvas.width + 50) {
            SceneState.setState(SCENE.GAME);
        }
    };

    const calculateLaserDimensions = function() {
        if(ufoStallTime > 1200) {
            laserWidth = 5;
            laserHeight = canvas.height * (1500 - ufoStallTime) / 300;
        } else if(ufoStallTime > 300) {
            laserHeight = canvas.height;
            laserWidth = 5 + 4 * (Math.sin((Math.PI / 180) * 3 * (1200 - ufoStallTime)));
        } else {
            laserWidth = 5;
            laserHeight = canvas.height * (ufoStallTime) / 300;
        }
    };

    const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        if(ufoIsStalled) {
            drawRect(124 - ((laserWidth - 2) / 2), 30, laserWidth, laserHeight, laserColors[laserColorIndex]);
        }
        ufo.drawAt(ufoPosition.x, ufoPosition.y);

        fontRenderer.drawString(canvasContext, titlePos, 5, "THE BAR", FONT.Stroked);

        canvasContext.drawImage(barBackImage, 53, 61);

        cutScenePlayer.draw(deltaTime);

        canvasContext.drawImage(barFrontImage, 83, 95);

	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, "#252525");
    };
}