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
    let laserColors = ['#A2E7E5', '#A9E5F8', '#BFF8E3', '#A2E7E5', '#A9E5F8']
    let laserColorIndex = 0


    this.transitionIn = function() {
        cutScenePlayer = new CutScenePlayer(0, 100);
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
        
        /*if((cutScenePlayer.position.x >= 53) && (!reachedTruck)) {
            reachedTruck = true;
            cutScenePlayer.climb();
        } else if((cutScenePlayer.position.y < 34) && (!climbedTruck)) {
            climbedTruck = true;
            cutScenePlayer.walk();
        } else if((cutScenePlayer.position.x > 80) && (!onTruck)) {
            cutScenePlayer.idle();
            onTruck = true;
        } else if((onTruck) && (truckPos <= canvas.width + 10)) {
            truckPos++;
            cutScenePlayer.position.x++;
        } else if((onTruck) && (truckPos > canvas.width + 10)){
            SceneState.setState(SCENE.GAME);
        }*/

        if((ufoPosition.x < ufoStallPosition) && (!ufoTurnedAround)) {
            ufoPosition.x++;
        } else if((ufoPosition.x >= ufoStallPosition) && (ufoStallTime > 0)) {
            ufoStallTime -= deltaTime;
            ufoIsStalled = true;
            laserColorIndex = (laserColorIndex + 2) % 5;
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

    const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        if(ufoIsStalled) {
            drawRect(117, 30, 15, canvas.height * (1500 - ufoStallTime) / 2000, laserColors[laserColorIndex]);
        }
        ufo.drawAt(ufoPosition.x, ufoPosition.y);

        fontRenderer.drawString(canvasContext, titlePos, 5, "THE BAR", FONT.Stroked);

        cutScenePlayer.draw(deltaTime);
	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, "#252525");
        canvasContext.drawImage(titleScreenPic, 0, 0);
    };
}