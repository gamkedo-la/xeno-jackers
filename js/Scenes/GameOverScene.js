//Lvl1ToLvl2CutScene
function GameOverScene() {
    let cutScenePlayer;
    let inputWidth = 0;
    const anyKeyPrompt = "Any key to try again";
    const ufoPosition = {x: 55, y: 20};

    this.transitionIn = function() {
        currentBackgroundMusic.loopSong(GAMEOVER_MUSIC_FILENAME);
        cutScenePlayer = new CutScenePlayer(35, 60);
        cutScenePlayer.die();

        const titleWidth = fontRenderer.getWidthOfText("GAME OVER", 1, FONT.Stroked);
        titlePos = Math.round((canvas.width - titleWidth) / 2);

        inputWidth = fontRenderer.getWidthOfText(anyKeyPrompt, 1, FONT.LightGrey);

        ufo = new SpriteAnimation('idle', ufoSpriteSheet, [0, 1, 2, 3], 50, 26, [200], false, true);
        // ufoPosition = {x: 0, y: 20};
        // ufoTurnedAround = false;
        // ufoExiting = false;
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
                SceneState.setState(SCENE.TITLE);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        cutScenePlayer.update(deltaTime);
        ufo.update(deltaTime);
        
        // if((ufoPosition.x < 40) && (!ufoTurnedAround)) {
        //     ufoPosition.x++;
        // } else if((ufoPosition.x >= 40) && (!ufoTurnedAround)) {
        //     ufoPosition.x--;
        //     ufoTurnedAround = true;
        // } else if((ufoPosition.x > 5) && (!ufoExiting)) {
        //     ufoPosition.x--;
        // } else if((ufoPosition.x <= 5) && (!ufoExiting)) {
        //     ufoExiting = true;
        //     ufoPosition.x += 3;
        // } else {
        //     ufoPosition.x += 3;
        // }
    };

    const draw = function(deltaTime) {
        drawBG();

        ufo.drawAt(ufoPosition.x, ufoPosition.y);

        fontRenderer.drawString(canvasContext, titlePos, 5, "GAME OVER", FONT.Stroked);
        fontRenderer.drawString(canvasContext, (canvas.width - inputWidth) / 2, 120, anyKeyPrompt, FONT.LightGrey);

        cutScenePlayer.draw(deltaTime);
	};
	
	const drawBG = function() {
        drawRect(0, 0, canvas.width, canvas.height, "#262626");
        drawRect(0, 60, canvas.width, 40, "#666666");
    };
}