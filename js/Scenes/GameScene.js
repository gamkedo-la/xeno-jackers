//Game Play scene
function GameScene() {
    const TRANSITION_TIME = 300;
    let gameUI = null;
    let mapLoader = null;
    let currentMap = null;
    let mapRenderer = null;
    let camera = null;
    let collisionManager = null;
    let score = 0;
    let remainingLives = 2;
    let reloading = false;

    const enemies = [];
    const enemiesToRemove = [];
    const environmentColliders = [];

    let hasChain = false;
    let hasWheel = false;
    let hasHandlebar = false;
    let hasEngine = false;

    this.transitionIn = function() {
        if(mapLoader === null) {
            mapLoader = new MapLoader();
        }

        let loadedNewMap = false;
        if((currentMap === null) || (currentMap.name != currentLevelName)) {
            loadedNewMap = true;
            currentMap = mapLoader.loadMap(currentLevelName);
        }

        let needToRepositionPlayer = false;
        if(player === null) {
            needToRepositionPlayer = true;
            player = new Player(canvas.width / 2 + 8, canvas.height / 2 + 8, hasChain, hasWheel, hasHandlebar, hasEngine);
        }

        player.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
        player.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);

        if(collisionManager === null) {
            collisionManager = new CollisionManager(player);
        }

        if(loadedNewMap) {
            for(let collider of currentMap.colliders) {
                environmentColliders.push(collider);
                collisionManager.addEntity(collider);
            }
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

        if(loadedNewMap) {
            enemies.length = 0;
            for(let entityData of currentMap.entities) {
                if(entityData.type === EntityType.EnemyBiker) {
                    const anEnemy = new BikerEnemy(entityData.x, entityData.y - 33);
                    enemies.push(anEnemy);//33 is height of biker enemy
                    collisionManager.addEntity(anEnemy);
                }
            }
        }

        if(mapRenderer === null) {
            mapRenderer = new MapRenderer(canvas, canvasContext, tileSheet);
        }

        if(needToRepositionPlayer) {
            player.setPosition(currentMap.playerSpawn.x, currentMap.playerSpawn.y - player.getSize().height);
        }
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
        if(update(deltaTime, this)) {
            //Only draw the scene if this isn't a game over
            draw(deltaTime);
        }
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
            default:
                if(verifyNewKeyPressed(newKeyEvent, pressed, pressedKeys)) {
                    player.newKeyPressed(newKeyEvent);
                }
        }
        
        return false;
    };

    this.removeMe = function(entityToRemove) {
        enemiesToRemove.push(entityToRemove);
        score += pointsForType(entityToRemove.type);
    };

    this.gotChain = function() {
        hasChain = true;
    };

    this.gotWheel = function() {
        hasWheel = true;
    };

    this.gotHandlebar = function() {
        hasHandlebar = true;
    };

    this.gotEngine = function() {
        hasEngine = true;
    };

    const verifyNewKeyPressed = function(newKeyEvent, pressed, pressedKeys) {
        if(!pressed) return false;

        for(let key of pressedKeys) {
            if(key === newKeyEvent) {
                return false
            }
        }

        return true;
    }

    const reset = function() {
        mapLoader = null;
        currentMap = null;
        mapRenderer = null;
        camera = null;
        collisionManager = null;
        player = null;
        gameUI = null;

        enemies.length = 0;
        enemiesToRemove.length = 0;
        environmentColliders.length = 0;
        
        reloading = false;
    };

    const reloadLevel = function(context) {
        reloading = true;
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        setTimeout(() => {
            reset();

            context.transitionIn();
        }, TRANSITION_TIME);
    };

    const transitionToGameOver = function() {
        reloading = true;
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        setTimeout(() => {
            reset();

            SceneState.setState(SCENE.TITLE);//TODO: This should be game over
        }, TRANSITION_TIME);
    };

    const update = function(deltaTime, context) {
        if(reloading) return false;

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
            if(enemyToRemove === player) {
                remainingLives--;
                if(remainingLives < 0) {
                    transitionToGameOver();
                } else {
                    player.setPosition(currentMap.playerSpawn.x, currentMap.playerSpawn.y - player.getSize().height);
                    reloadLevel(context);    
                }
                return false;
            }
            collisionManager.removeEntity(enemyToRemove);
            enemies.splice(enemies.indexOf(enemyToRemove), 1);
        }
        enemiesToRemove.length = 0;

        gameUI.update(deltaTime, player);

        return true;
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