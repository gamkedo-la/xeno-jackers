//FlyingEnemy.js
function FlyingEnemy(posX, posY) {
    const WIDTH = 35;
	const ANIM_WIDTH = 35
    const HEIGHT = 24;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const MIN_TIME_TO_CACKLE = 800;
    const MEDIAN_TIME_TO_CACLE = 400;
    const HEALTH_DROP_PROBABILITY = 30;
    const FLASH_TIME = 300;
    const ATTACK_DIST = 100;
    const ATTACK_SPEED = 100;
    const RESET_SPEED = 50;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    let spawnPoint = {x:posX, y:posY};
    let velocity = {x:0, y:0};
    let timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
    let flipped = false;
    let isAttacking = false;
    let isResetting = false;

    let flashTimer = FLASH_TIME;

    this.type = EntityType.EnemyFlyer;
    this.dead = false;
    this.health = 1;

    this.collisionBody = new AABBCollider([
        {x:posX + 1, y:posY}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 34, y:posY}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 34, y:posY + HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 1, y:posY + HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
    ]);

    this.getSize = function() {
        return SIZE;
    };

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;

        if(currentAnimation === animations.death) {
            if(currentAnimation.getIsFinished()) {
                SceneState.scenes[SCENE.GAME].removeMe(this);
            }
            return;
        }

        if(this.collisionBody.isOnScreen) {
            if(flashTimer < FLASH_TIME) {
                flashTimer += deltaTime;
                if(Math.floor(flashTimer / 100) % 2 === 0) {
                    currentAnimation.useBrightImage = !currentAnimation.useBrightImage;
                }
            } else {
                flashTimer = FLASH_TIME;
                currentAnimation.useBrightImage = false;
            }

            timeToCackle -= deltaTime;
            if(timeToCackle <= 0) {
                alienGrowl2.play();
                timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
            }

            const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);
            const yPos = position.y + Math.round(velocity.y * deltaTime / 1000);

            this.setPosition(xPos, yPos);

            let distToPlayer = 0;
            if(player.collisionBody.center.x < this.collisionBody.center.x) {
                flipped = true;
                distToPlayer = this.collisionBody.center.x - player.collisionBody.center.x;
            } else {
                flipped = false;
                distToPlayer = player.collisionBody.center.x - this.collisionBody.center.x;
            }

            if(distToPlayer < ATTACK_DIST) {
                let dirToPlayer = {x: 0, y: 0};
                dirToPlayer.x = player.collisionBody.center.x - this.collisionBody.center.x;
                dirToPlayer.y = player.collisionBody.center.y - this.collisionBody.center.y;
                dirToPlayer = normalize(dirToPlayer);
                if(magnitudeOfVec(velocity) < 0.1) {
                    //need to start attacking
                    velocity.x = ATTACK_SPEED * dirToPlayer.x;
                    velocity.y = ATTACK_SPEED * dirToPlayer.y;
                    //currentAnimation = animations.attacking;
                    //currentAnimation.reset();
                    isAttacking = true;
                } else {
                    //already attacking, should continue or reset?
                    if((isAttacking) && (dotProduct(dirToPlayer, velocity) > 0)) {
                        //keep attacking
                    } else {
                        //reset
                        isAttacking = false;
                        let dirToSpawn = {x: spawnPoint.x - this.collisionBody.center.x - canvas.offsetX, y: spawnPoint.y - this.collisionBody.center.y + canvas.offsetY};
                        if(magnitudeOfVec(dirToSpawn) < 32) {//No idea why 32 is the magic number
                            //reached spawn point, stop resetting
                            isResetting = false;
                            velocity.x = 0;
                            velocity.y = 0;
                        } else if(isResetting) {
                            //continue resetting
                        } else {
                            //need to start resetting
                            isResetting = true;
                            dirToSpawn = normalize(dirToSpawn);
                            velocity.x = RESET_SPEED * dirToSpawn.x;
                            velocity.y = RESET_SPEED * dirToSpawn.y;
                        }
                    }
                }
            }
        }
        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function(deltaTime) {
        if(this.collisionBody.isOnScreen) {
            if(currentAnimation === animations.death) {
                currentAnimation.drawAt(position.x + 9, position.y, flipped);
            } else {
                currentAnimation.drawAt(position.x, position.y - 2, flipped);
            }

            //colliders only draw when DRAW_COLLIDERS is set to true
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            isAttacking = false;
        } else if(isPlayerTool(otherEntity) && otherEntity.isActive) {
            this.health--;
            if((this.health <= 0) && (currentAnimation !== animations.death)) {
                const healthDropChance = 100 * Math.random();
                if(healthDropChance < HEALTH_DROP_PROBABILITY) {
                    SceneState.scenes[SCENE.GAME].addHealthDrop(position.x, position.y);
                }
                this.dead = true;
                currentAnimation = animations.death;
                flashTimer = FLASH_TIME;
                currentAnimation.useBrightImage = false;
            } else if(currentAnimation === animations.death) {
                // do nothing
            } else if(this.health > 0) {
                flashTimer = 0;
            }
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move biker enemy the full amount of the overlap
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                this.setPosition(position.x + collisionData.deltaX, position.y);
            } else {
                this.setPosition(position.x, position.y + collisionData.deltaY);
            }

            this.collisionBody.setPosition(position.x, position.y);
        }
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', enemyFlyerSheet, [0, 1, 2, 3], ANIM_WIDTH, HEIGHT, [128], false, true, [0], enemyFlyerBrightSheet);
        anims.death = new SpriteAnimation('death', deathSheet, [0, 1, 2, 3], 16, 16, [100], false, false);
        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}