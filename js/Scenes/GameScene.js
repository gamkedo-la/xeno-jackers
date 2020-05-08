//Game Play scene
function GameScene() {
    let gameUI = null;
    let mapLoader = null;
    let currentMap = null;
    let mapRenderer = null;

    const enemies = [];
    this.transitionIn = function() {
        if(player === null) {
            player = new Player();
        }

        if(gameUI === null) {
            gameUI = new GameUI(canvas, canvasContext);
        }

        if(enemies.length === 0) {
            enemies.push(new BikerEnemy(canvas.width / 4, canvas.height / 2 + 16));
        }

        if(mapLoader === null) {
            mapLoader = new MapLoader();
        }

        currentMap = mapLoader.loadMap(currentLevelName);

        if(mapRenderer === null) {
            mapRenderer = new MapRenderer(canvas, canvasContext, tileSheet);
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
                    if(!gameIsPaused) {
                        pauseSound.play();
                        SceneState.setState(SCENE.PAUSE);
                    }
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
        mapRenderer.drawSkybox(canvasContext, currentMap.skybox);

        mapRenderer.drawTileLayer(currentMap.backgroundTiles.tiles, currentMap.backgroundTiles.widthInTiles, canvas.width / 2, canvas.height/2);
        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles, canvas.width / 2, canvas.height / 2);

        player.draw(deltaTime);
        for(enemy of enemies) {
            enemy.draw(deltaTime);
        }

        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles, canvas.width / 2, canvas.height / 2);

        gameUI.draw(deltaTime);
    }
}