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

    const highwayAutoScrollTime = 20000;
    const highwayAutoScrollLimit = 600;

    let highwayScrollTime = 0;

    let hasChain = false;
    let hasWheel = false;
    let hasHandlebar = false;
    let hasEngine = false;

    let canExitBar = false;

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

        if(currentLevelName === MAP_NAME.Highway) {
            player.setLevelWidth(highwayAutoScrollLimit);
            player.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);
            } else {
            player.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
            player.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);    
        }

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

        if(currentLevelName === MAP_NAME.Highway) {
            camera.setLevelWidth(highwayAutoScrollLimit);
            camera.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);
        } else {
            camera.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
            camera.setLevelHeight(currentMap.collisionTiles.heightInTiles * TILE_HEIGHT);
        }

        if(gameUI === null) {
            gameUI = new GameUI(canvas, canvasContext);
            gameUI.hasChain = hasChain;
            gameUI.hasWheel = hasWheel;
            gameUI.hasHandlebar = hasHandlebar;
            gameUI.hasEngine = hasEngine;
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

            player.setToolSpawnPoint(deltaX, deltaY);

            for(let env of environmentColliders) {
                env.setSpawnPoint(env.collisionBody.position.x - deltaX, env.collisionBody.position.y - deltaY);
            }

            for(let enemy of enemies) {
                enemy.setSpawnPoint(enemy.collisionBody.position.x - deltaX, enemy.collisionBody.position.y - deltaY);
            }

            for(let other of otherEntities) {
                other.setSpawnPoint(other.collisionBody.position.x - deltaX, other.collisionBody.position.y - deltaY)
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

    this.mechDefeated = function(mech) {
        canExitBar = true;
        this.removeMe(mech);
    };

    this.addCollisionEntity = function(entity) {
        collisionManager.addEntity(entity);
    };

    this.removeCollisionEntity = function(entity) {
        collisionManager.removeEntity(entity);
    };

    this.addHealthDrop = function(posX, posY) {
        const newHealth = new health(posX, posY);
        otherEntities.push(newHealth);
        collisionManager.addEntity(newHealth);
    };

    this.addFlyingFist = function(posX, posY, flipped) {
        const newFist = new FlyingFist(flipped);
        newFist.activate(posX, posY);
        otherEntities.push(newFist);
        collisionManager.addEntity(newFist);
    }

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

    this.playerAtExit = function() {
        //We'll want to check if the current level's boss has been defeated, but for now...
        switch(currentLevelName) {
            case MAP_NAME.Bar:
                if(canExitBar) {
                    this.reset();
                    currentLevelName = MAP_NAME.Highway;
                    SceneState.setState(SCENE.LVL1LVL2);
                }
                break;
            case MAP_NAME.Highway:
                this.reset();
                currentLevelName = MAP_NAME.Area51;
                SceneState.setState(SCENE.GAME);//TODO: Needs to be the Lvl2Lvl3 Cutscene
                break;
            case MAP_NAME.Area51:
                this.reset();
                currentLevelName = MAP_NAME.Boss;
                SceneState.setState(SCENE.GAME);//TODO: Needs to be the Lvl3Boss Cutscene
                break;
            case MAP_NAME.Boss:
                this.reset();
                currentLevelName = MAP_NAME.Bar;
                SceneState.setState(SCENE.CREDITS);
                break;
        }
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

    this.reset = function() {
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
        otherEntities.length = 0;
        
        highwayScrollTime = 0;
        reloading = false;
    };

    self = this;
    const reloadLevel = function(context) {
        reloading = true;
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        setTimeout(() => {
            self.reset();

            context.transitionIn();
        }, TRANSITION_TIME);
    };

    const loadEntities = function(enemyData) {
        for(let data of enemyData) {
            let anEntity;
//            console.log("new entity: "+data.type);
            switch(data.type) {
                case EntityType.EnemyBiker:
                    anEntity = new BikerEnemy(data.x, data.y - 33);//33 is height of biker enemy
                    enemies.push(anEntity);
                    break;
                case EntityType.EnemyBiker2:
                    anEntity = new BikerEnemy2(data.x, data.y - 33);//33 is height of biker enemy
                    enemies.push(anEntity);
                    break;
                case EntityType.EnemyCrawler:
                    anEntity = new CrawlerEnemy(data.x, data.y - 10);//10 is height of crawler enemy
                    enemies.push(anEntity);
                    break;
                case EntityType.EnemyFlyer:
                    anEntity = new FlyingEnemy(data.x, data.y - 24);//24 is height of crawler enemy
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
                case EntityType.Lamp:
                    anEntity = new Lamp(data.x, data.y);
                    otherEntities.push(anEntity);
                    break;
                case EntityType.ChainPickup:
                    if(!hasChain) {
                        anEntity = new UpgradePickup(EntityType.ChainPickup, data.x, data.y - 16);
                        otherEntities.push(anEntity);
                    }
                    break;
                case EntityType.WheelPickup:
                    if(!hasWheel) {
                        anEntity = new UpgradePickup(EntityType.WheelPickup, data.x, data.y - 16);
                        otherEntities.push(anEntity);
                    }
                    break;
                case EntityType.HandlebarPickup:
                    if(!hasHandlebar) {
                        anEntity = new UpgradePickup(EntityType.HandlebarPickup, data.x, data.y - 16);
                        otherEntities.push(anEntity);
                    }
                    break;
                case EntityType.EnginePickup:
                    if(!hasEngine) {
                        anEntity = new UpgradePickup(EntityType.EnginePickup, data.x, data.y - 16);
                        otherEntities.push(anEntity);
                    }
                    break;
            }

            collisionManager.addEntity(anEntity);
        }
    };

    const transitionToGameOver = function() {
        reloading = true;
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        setTimeout(() => {
            hasChain = false;
            hasWheel = false;
            hasHandlebar = false;
            hasEngine = false;
            currentLevelName = MAP_NAME.Bar;
            score = 0;

            self.reset();

            SceneState.setState(SCENE.TITLE);//TODO: This should be game over
        }, TRANSITION_TIME);
    };

    const update = function(deltaTime, context) {
        if(reloading) return false;

        if(currentLevelName === MAP_NAME.Highway) {
            highwayScrollTime += deltaTime;
            if(highwayScrollTime > highwayAutoScrollTime) {
                player.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);
                camera.setLevelWidth(currentMap.collisionTiles.widthInTiles * TILE_WIDTH);

            }
        }

        mapRenderer.update(deltaTime);

        player.update(deltaTime);
        camera.update(player);

        for(let env of environmentColliders) {
            if((highwayScrollTime >= highwayAutoScrollTime) && (env.type === EntityType.Roadzone)) {
                env.type = EntityType.Ground;
            }
            env.update(deltaTime);
        }

        for(let enemy of enemies) {
            enemy.update(deltaTime, player);
        }

        for(let gameObject of otherEntities) {
            gameObject.update(deltaTime, player);
        }

        collisionManager.doCollisionChecks();
        if(player === null) return;
        player.fsm.update(deltaTime);
        newlyPressed.length = 0;

        for(let entityToRemove of entitiesToRemove) {
            if(entityToRemove === player) {
                remainingLives--;
                if(remainingLives < 0) {
                    remainingLives = 2;
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

    var autoScrollX = 0; // background scrolling counter for highway level
    let parallaxScale = 1; // increase for a slower bg or extra layers

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
        
        let offsetX = 0; // scrolling bg
        let wobbleY = 0; // bouncing tires
        if ((currentLevelName === MAP_NAME.Highway) && (highwayScrollTime < highwayAutoScrollTime)) {
            autoScrollX--; // integer only for crispness
            offsetX = Math.floor((autoScrollX / parallaxScale) % TILE_WIDTH);
            wobbleY = Math.floor(Math.sin(performance.now() / 50)) + 1;
        } else {
            mapRenderer.stopAnimating([150, 151, 214, 215]);
        }
        
        mapRenderer.drawSkybox(canvasContext, currentMap.skybox);
        mapRenderer.drawTileLayer(currentMap.farBackgroundTiles.tiles, currentMap.farBackgroundTiles.widthInTiles, offsetX);
        if(currentLevelName === MAP_NAME.Highway) {
            mapRenderer.drawScrollingTileLayer(mapLoader.backgroundMap.nearBackgroundTiles.tiles, mapLoader.backgroundMap.widthInTiles, 0.5 * autoScrollX);
        }
        mapRenderer.drawTileLayer(currentMap.nearBackgroundTiles.tiles, currentMap.nearBackgroundTiles.widthInTiles);
        mapRenderer.drawTileLayer(currentMap.collisionTiles.tiles, currentMap.collisionTiles.widthInTiles, 0, wobbleY);

        for(let enemy of enemies) {
            enemy.draw(deltaTime);
        }

        for(let gameObject of otherEntities) {
            gameObject.draw();
        }

        player.draw(deltaTime);

        mapRenderer.drawTileLayer(currentMap.foregroundTiles.tiles, currentMap.foregroundTiles.widthInTiles);
        if(currentLevelName === MAP_NAME.Highway) {
            mapRenderer.drawScrollingTileLayer(mapLoader.foregroundMap.foregroundTiles.tiles, mapLoader.foregroundMap.widthInTiles, 2 * autoScrollX);
        }

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