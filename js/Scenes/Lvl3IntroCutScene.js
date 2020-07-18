//Lvl3IntroCutScene.js
function Lvl3IntroCutScene() {
    let cutScenePlayer;

    this.transitionIn = function() {
        cutScenePlayer = new CutScenePlayer(0, 100);
        const titleWidth = fontRenderer.getWidthOfText("AREA 51", 1, FONT.Stroked);
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

        if(cutScenePlayer.position.x > 66) cutScenePlayer.fall();

        if(cutScenePlayer.position.y > 150) SceneState.setState(SCENE.GAME);
    };

    const draw = function(deltaTime) {
        drawBG();

        fontRenderer.drawString(canvasContext, titlePos, 5, "AREA 51", FONT.Stroked);

        drawFloor();

        cutScenePlayer.draw(deltaTime);
	};
	
	const drawBG = function() {
        drawRect(0, 0, canvas.width, canvas.height, "#262626");
    };

    const drawFloor = function() {
        for(let i = 0; i < 20; i++) {
            if((i > 11) && (i < 16)) continue;
            canvasContext.drawImage(tileSheet, 39 * 8, 4 * 8, 8, 8, i * 8, 102 + cutScenePlayer.getSize().height, 8, 8);
        }

        for(let i = 0; i < 20; i++) {
            canvasContext.drawImage(tileSheet, 41 * 8, 7 * 8, 8, 8, i * 8, 88, 8, 8);
        }

        for(let i = 0; i < 13; i++) {
            canvasContext.drawImage(tileSheet, 47 * 8, 5 * 8, 8, 8, i * 8, 120, 8, 8);
        }

        canvasContext.drawImage(tileSheet, 46 * 8, 4 * 8, 8, 8, 13 * 8, 120, 8, 8);
        
        for(let i = 0; i < 5; i++) {
            canvasContext.drawImage(tileSheet, 47 * 8, 4 * 8, 8, 8, 13 * 8, 128 + i * 8, 8, 8);
        }

        for(let i = 0; i < 12; i += 8) {
            canvasContext.drawImage(tileSheet, 46 * 8, 8 * 8, 8, 8, i * 8, 96, 8, 8);
            canvasContext.drawImage(tileSheet, 47 * 8, 8 * 8, 8, 8, (i + 1) * 8, 96, 8, 8);
            canvasContext.drawImage(tileSheet, 46 * 8, 9 * 8, 8, 8, i * 8, 104, 8, 8);
            canvasContext.drawImage(tileSheet, 47 * 8, 9 * 8, 8, 8, (i + 1) * 8, 104, 8, 8);
        }

        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 16 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 17 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 18 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 19 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 13 * 8, 8, 8, 16 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 13 * 8, 8, 8, 17 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 13 * 8, 8, 8, 18 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 13 * 8, 8, 8, 19 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 16 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 17 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 18 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 19 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 16 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 17 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 18 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 19 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 16 * 8, 128, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 17 * 8, 128, 8, 8);
        canvasContext.drawImage(tileSheet, 46 * 8, 12 * 8, 8, 8, 18 * 8, 128, 8, 8);
        canvasContext.drawImage(tileSheet, 47 * 8, 12 * 8, 8, 8, 19 * 8, 128, 8, 8);
        
        canvasContext.drawImage(tileSheet, 42 * 8, 7 * 8, 8, 8, 17 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 43 * 8, 7 * 8, 8, 8, 18 * 8, 96, 8, 8);
        canvasContext.drawImage(tileSheet, 42 * 8, 8 * 8, 8, 8, 17 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 43 * 8, 8 * 8, 8, 8, 18 * 8, 104, 8, 8);
        canvasContext.drawImage(tileSheet, 42 * 8, 9 * 8, 8, 8, 17 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 43 * 8, 9 * 8, 8, 8, 18 * 8, 112, 8, 8);
        canvasContext.drawImage(tileSheet, 42 * 8, 10 * 8, 8, 8, 17 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 43 * 8, 10 * 8, 8, 8, 18 * 8, 120, 8, 8);
        canvasContext.drawImage(tileSheet, 42 * 8, 5 * 8, 8, 8, 17 * 8, 128, 8, 8);
        canvasContext.drawImage(tileSheet, 43 * 8, 5 * 8, 8, 8, 18 * 8, 128, 8, 8);
    };
}