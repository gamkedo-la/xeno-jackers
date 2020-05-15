//Game Play scene
function GameScene() {
    let gameUI = null;
    let mapLoader = null;
    let currentMap = null;
    let mapRenderer = null;
    let camera = null;
    let collisionManager = null;
    let score = 0;
    let remainingLives = 2;

    const enemies = [];
    const enemiesToRemove = [];
    const environmentColliders = [];

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

        for(let collider of currentMap.colliders) {
            environmentColliders.push(collider);
            collisionManager.addEntity(collider);
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
            const anEnemy = new BikerEnemy(3 * canvas.width / 8, canvas.height / 2 + 16);
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

    this.removeMe = function(entityToRemove) {
        enemiesToRemove.push(entityToRemove);
        score += pointsForType(entityToRemove.type);
    };

    const update = function(deltaTime) {
        player.update(deltaTime);
        camera.update(player);

        for(let env of environmentColliders) {
            env.update(deltaTime);
        }

        for(let enemy of enemies) {
            enemy.update(deltaTime, player);
        }

        collisionManager.doCollisionChecks();

        for(let enemyToRemove of enemiesToRemove) {
            collisionManager.removeEntity(enemiesToRemove);
            enemies.splice(enemies.indexOf(enemyToRemove), 1);
        }
        enemiesToRemove.length = 0;

        gameUI.update(deltaTime, player);
    };

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height);
        mapRenderer.drawSkybox(canvasContext, currentMap.skybox);

        mapRenderer.drawTileLayer(currentMap.farBackgroundTiles.tiles, currentMap.farBackgroundTiles.widthInTiles, canvas.center.x, canvas.center.y);
        mapRenderer.drawTileLayer(currentMap.nearBackgroundTiles.tiles, currentMap.nearBackgroundTiles.widthInTiles, canvas.center.x, canvas.center.y);
        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles, canvas.center.x, canvas.center.y);

        player.draw(deltaTime);
        for(enemy of enemies) {
            enemy.draw(deltaTime);
        }

        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles, canvas.center.x, canvas.center.y);

        for(let env of environmentColliders) {
            env.draw();
        }

        gameUI.draw(deltaTime, score, remainingLives);
    };

    const pointsForType = function(type) {
        switch(type) {
            case EntityType.EnemyBiker:
                return POINTS.EnemyBiker;
            case EntityType.EnemyAlienGuard:
                return POINTS.EnemyAlienGuard;
            case EntityType.FinalBoss:
                return POINTS.FinalBoss;
            default:
                return 0;
        }
    };
}