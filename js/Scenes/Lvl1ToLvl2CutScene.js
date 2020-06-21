//Lvl1ToLvl2CutScene
//Options Scene
function Lvl1ToLvl2CutScene() {
    let cutScenePlayer;
    let reachedTruck = false;
    let climbedTruck = false;
    let onTruck = false;
    let moving = false;
    let truckPos = 100;
    let titlePos = 20;

    this.transitionIn = function() {
        cutScenePlayer = new CutScenePlayer(0, 80);
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
        if((cutScenePlayer.position.x >= 53) && (!reachedTruck)) {
            reachedTruck = true;
            cutScenePlayer.climb();
        } else if((cutScenePlayer.position.y < 14) && (!climbedTruck)) {
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
    };

    const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        fontRenderer.drawString(canvasContext, titlePos, 5, "THE HIGHWAY", FONT.Stroked);

        cutScenePlayer.draw(deltaTime);
        canvasContext.drawImage(cutsceneTruck, truckPos, 48);
	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, "#252525");
    };
}