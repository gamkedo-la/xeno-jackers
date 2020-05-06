//Game Play scene
function GameScene() {
    let gameUI = null;
    const enemies = [];
    this.transitionIn = function() {
        if(player === null) {
            player = new Player();
        }

        if(gameUI === null) {
            gameUI = new GameUI(canvas, canvasContext);
        }

        if(enemies.length === 0) {
            enemies.push(new BikerEnemy(canvas.width / 4, canvas.height / 2));
        }
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    }

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        switch (newKeyEvent) {
            case KEY_P:
                for(key of pressedKeys) {
                    if(key === newKeyEvent) {
                        return;
                    }
                }
                
                if(pressed) {
                    SceneState.setState(SCENE.PAUSE);
                }
                return true;
            case ALIAS.CHEATS:
                CHEATS_ACTIVE = !CHEATS_ACTIVE;
                return true;
            case ALIAS.DEBUG:
                DEBUG = !DEBUG;
                console.log("Debug? " + DEBUG);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        player.update(deltaTime);
        for(enemy of enemies) {
            enemy.update(deltaTime, player);
        }

        gameUI.update(deltaTime, player);
    }

    const draw = function(deltaTime) {
        //Temp until we get Tiled integration working
        canvasContext.drawImage(tempGameSceneBG, 0, 0, tempGameSceneBG.width, tempGameSceneBG.height, 0, 0, tempGameSceneBG.width * GAME_SCALE, tempGameSceneBG.height * GAME_SCALE);

        player.draw(deltaTime);
        for(enemy of enemies) {
            enemy.draw(deltaTime);
        }

        gameUI.draw(deltaTime);
    }
}