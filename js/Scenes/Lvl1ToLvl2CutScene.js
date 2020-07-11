//Lvl1ToLvl2CutScene
//Options Scene
function Lvl1ToLvl2CutScene() {
    let cutScenePlayer;
    let reachedTruck = false;
    let climbedTruck = false;
    let onTruck = false;
    let truckPos = 80;
    let titlePos = 20;
    let ufo = null;
    let ufoPosition = {x: 0, y: 20};
    let ufoTurnedAround = false;
    let ufoExiting = false;

    this.transitionIn = function() {
        cutScenePlayer = new CutScenePlayer(0, 100);
        reachedTruck = false;
        climbedTruck = false;
        onTruck = false;
        truckPos = 80;
        titlePos = 20;
        ufo = new SpriteAnimation('idle', ufoSpriteSheet, [0, 1, 2, 3], 50, 26, [360], false, true);
        ufoPosition = {x: 0, y: 20};
        ufoTurnedAround = false;
        ufoExiting = false;
        const titleWidth = fontRenderer.getWidthOfText("THE HIGHWAY", 1, FONT.Stroked);
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
        
        if((cutScenePlayer.position.x >= 53) && (!reachedTruck)) {
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
        }

        if((ufoPosition.x < 40) && (!ufoTurnedAround)) {
            ufoPosition.x++;
        } else if((ufoPosition.x >= 40) && (!ufoTurnedAround)) {
            ufoPosition.x--;
            ufoTurnedAround = true;
        } else if((ufoPosition.x > 5) && (!ufoExiting)) {
            ufoPosition.x--;
        } else if((ufoPosition.x <= 5) && (!ufoExiting)) {
            ufoExiting = true;
            ufoPosition.x += 3;
        } else {
            ufoPosition.x += 3;
        }
    };

    const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        ufo.drawAt(ufoPosition.x, ufoPosition.y);

        fontRenderer.drawString(canvasContext, titlePos, 5, "THE HIGHWAY", FONT.Stroked);

        canvasContext.drawImage(cutsceneTruck, truckPos, 68);
        cutScenePlayer.draw(deltaTime);
	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, "#252525");
    };
}