//Game Play scene
function GameScene() {
    let gameUI = null;
    let mapLoader = null;
    let currentMap = null;
    let mapRenderer = null;
    let camera = null;
    let collisionManager = null;

    const enemies = [];
    this.transitionIn = function() {
        if(mapLoader === null) {
            mapLoader = new MapLoader();
        }

        currentMap = mapLoader.loadMap(currentLevelName);

        if(player === null) {
            player = new Player(canvas.width / 2 + 8, canvas.height / 2 + 8);
        }

        player.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
        player.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);

        if(collisionManager === null) {
            collisionManager = new CollisionManager(player);
        }

        if(camera === null) {
            canvas.center = {};
            canvas.deltaX = 0;
            canvas.deltaY = 0;
            camera = new Camera(canvas);
        }

        camera.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
        camera.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);

        if(gameUI === null) {
            gameUI = new GameUI(canvas, canvasContext);
        }

        if(enemies.length === 0) {
            const anEnemy = new BikerEnemy(canvas.width / 4, canvas.height / 2 + 16);
            enemies.push(anEnemy);
            collisionManager.addEntity(anEnemy);
        }

        if(mapRenderer === null) {
            mapRenderer = new MapRenderer(canvas, canvasContext, tileSheet);
        }
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    };

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
        camera.update(player);
        for(enemy of enemies) {
            enemy.update(deltaTime, player);
        }

        gameUI.update(deltaTime, player);
    };

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height);
        mapRenderer.drawSkybox(canvasContext, currentMap.skybox);

//        mapRenderer.drawTileLayer(currentMap.backgroundTiles.tiles, currentMap.backgroundTiles.widthInTiles, canvas.width / 2, canvas.height/2);
//        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles, canvas.width / 2, canvas.height / 2);
        mapRenderer.drawTileLayer(currentMap.backgroundTiles.tiles, currentMap.backgroundTiles.widthInTiles, canvas.center.x, canvas.center.y);
        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles, canvas.center.x, canvas.center.y);

        player.draw(deltaTime);
        for(enemy of enemies) {
            enemy.draw(deltaTime);
        }

//        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles, canvas.width / 2, canvas.height / 2);
        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles, canvas.center.x, canvas.center.y);

        gameUI.draw(deltaTime);
    };
}