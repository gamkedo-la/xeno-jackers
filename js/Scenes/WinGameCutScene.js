//WinGameCutScene
function WinGame2CutScene() {
    let cutScenePlayer;
    let didJump = false;
    let onBike = false;
    let titlePos = 20;
    let xenoMorph9000 = null;
    let bikePosition = {x: 80, y: 100};

    this.transitionIn = function() {
        currentBackgroundMusic.pauseSound();

        cutScenePlayer = new CutScenePlayer(0, 100);
        didJump = false;
        onBike = false;
        xenoMorph9000 = new SpriteAnimation('idle', XenoMorph9000, [0, 1, 2], 55, 35, [150], false, true);
        bikePosition = {x: 80, y: 100};
        const titleWidth = fontRenderer.getWidthOfText("Congratulations", 1, FONT.Stroked);
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
                SceneState.setState(SCENE.CREDITS);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        cutScenePlayer.update(deltaTime);
        xenoMorph9000.update(deltaTime);
        
        if((cutScenePlayer.position.x >= 30) && (!didJump)) {
            didJump = true;
            cutScenePlayer.jump();
        }

        if(onBike) {
            bikePosition.x++;
        }

        if(bikePosition.x > 160) {
            SceneState.setState(SCENE.CREDITS);
        }
    };

    const draw = function(deltaTime) {
        drawBG();

        xenoMorph9000.drawAt(bikePosition.x, bikePosition.y);

        fontRenderer.drawString(canvasContext, titlePos, 5, "Congratulations", FONT.Stroked);

        if(cutScenePlayer.position.x < 60) {
            cutScenePlayer.draw(deltaTime);
        } else {
            onBike = true;
        }
	};
	
	const drawBG = function() {
        drawRect(0, 0, canvas.width, canvas.height, "#262626");
    };
}