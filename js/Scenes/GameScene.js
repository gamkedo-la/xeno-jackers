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
    const entitiesToRemove = [];
    const environmentColliders = [];
    const otherEntities = [];

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
            loadEntities(currentMap.entities);
        }

        if(mapRenderer === null) {
            mapRenderer = new MapRenderer(canvas, canvasContext, tileSheet);
        }

        if(needToRepositionPlayer) {
            player.setSpawnPoint(currentMap.playerSpawn.x, currentMap.playerSpawn.y - player.getSize().height)
            const playerPos = player.getPosition();
            camera.setStartPos(playerPos.x, playerPos.y);
            const deltaX = playerPos.x - canvas.width / 2;
            const deltaY = playerPos.y - canvas.height / 2;
            for(let env of environmentColliders) {
                env.setSpawnPoint(env.collisionBody.position.x - deltaX, env.collisionBody.position.y - deltaY);
            }

            for(let enemy of enemies) {
                enemy.setSpawnPoint(enemy.collisionBody.position.x - deltaX, enemy.collisionBody.position.y - deltaY);
                console.log(`Spawn:(${enemy.collisionBody.position.x - deltaX}, ${enemy.collisionBody.position.y - deltaY})`);
            }
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
        entitiesToRemove.push(entityToRemove);
        score += pointsForType(entityToRemove.type);
    };

    this.addHealthDrop = function(posX, posY) {
        const newHealth = new health(posX, posY);
        otherEntities.push(newHealth);
        collisionManager.addEntity(newHealth);
    };

    this.gotChain = function() {
        hasChain = true;
        gameUI.hasChain = true;
    };

    this.gotWheel = function() {
        hasWheel = true;
        gameUI.hasWheel = true;
    };

    this.gotHandlebar = function() {
        hasHandlebar = true;
        gameUI.hasHandlebar = true;
    };

    this.gotEngine = function() {
        hasEngine = true;
        gameUI.hasEngine = true;
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
        entitiesToRemove.length = 0;
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

    const loadEntities = function(enemyData) {
        for(let data of enemyData) {
            let anEntity;
            console.log("new entity: "+data.type);
            switch(data.type) {
                case EntityType.EnemyBiker:
                    anEntity = new BikerEnemy(data.x, data.y - 33);//33 is height of biker enemy
                    enemies.push(anEntity);
                    break;
                case EntityType.EnemyAlienGuard:
                    anEntity = new EnemyAlienGuard(data.x, data.y - 33);
                    enemies.push(anEntity);
                    break;
                case EntityType.EnemyMech:
                    anEntity = new EnemyMech(data.x-12, data.y-36); // sprite is 36x36
                    enemies.push(anEntity);
                    break;
                case EntityType.ChainPickup:
                    anEntity = new UpgradePickup(EntityType.ChainPickup, data.x, data.y - 16);
                    otherEntities.push(anEntity);
                    break;
            }

            collisionManager.addEntity(anEntity);
        }
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

        mapRenderer.update(deltaTime);

        player.update(deltaTime);
        camera.update(player);

        for(let env of environmentColliders) {
            env.update(deltaTime);
        }

        for(let enemy of enemies) {
            enemy.update(deltaTime, player);
        }

        for(let gameObject of otherEntities) {
            gameObject.update(deltaTime, player);
        }

        collisionManager.doCollisionChecks();

        for(let entityToRemove of entitiesToRemove) {
            if(entityToRemove === player) {
                remainingLives--;
                if(remainingLives < 0) {
                    transitionToGameOver();
                } else {
                    player.setPosition(currentMap.playerSpawn.x, currentMap.playerSpawn.y - player.getSize().height);
                    reloadLevel(context);    
                }
                return false;
            }
            collisionManager.removeEntity(entityToRemove);
            if(isEnemy(entityToRemove)) {
                enemies.splice(enemies.indexOf(entityToRemove), 1);
            } else {
                otherEntities.splice(otherEntities.indexOf(entityToRemove), 1);
            }
        }
        entitiesToRemove.length = 0;

        gameUI.update(deltaTime, player);

        return true;
    };

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        mapRenderer.drawSkybox(canvasContext, currentMap.skybox);

        mapRenderer.drawTileLayer(currentMap.farBackgroundTiles.tiles, currentMap.farBackgroundTiles.widthInTiles);
        mapRenderer.drawTileLayer(currentMap.nearBackgroundTiles.tiles, currentMap.nearBackgroundTiles.widthInTiles);
        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles);

        player.draw(deltaTime);
        for(let enemy of enemies) {
            enemy.draw(deltaTime);
        }

        for(let gameObject of otherEntities) {
            gameObject.draw();
        }

        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles);

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
            case EntityType.ChainPickup:
            case EntityType.WheelPickup:
            case EntityType.HandlebarPickup:
            case EntityType.Engine:
                return POINTS.BikePart;
            default:
                return 0;
        }
    };
}