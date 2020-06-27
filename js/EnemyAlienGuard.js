//EnemyAlienGuard.js
function EnemyAlienGuard(posX, posY) {
    const SCALE = GAME_SCALE;
    const WIDTH = 23;
    const HEIGHT = 33;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const MIN_TIME_TO_GROWL = 1000;
    const MEDIAN_TIME_TO_GROWL = 500;
    const HEALTH_DROP_PROBABILITY = 50;
    const FLASH_TIME = 300; 

    let currentAnimation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    let timeToGrowl = MIN_TIME_TO_GROWL + MEDIAN_TIME_TO_GROWL * Math.random();
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
    let flipped = false;

    let flashTimer = FLASH_TIME;

    this.type = EntityType.EnemyAlienGuard;
    this.health = 7; //7 is minimum amount needed for two hits (1-6 = 1 HIT, 7-12 = 2 HITS, etc)

    this.collisionBody = new AABBCollider([
        {x:posX + 2, y:posY + 3}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 21, y:posY + 3}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 21, y:posY + HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 2, y:posY + HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
    ]);

    this.getSize = function() {
        return SIZE;
    };

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;

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

            timeToGrowl -= deltaTime;
            if(timeToGrowl <= 0) {
                alienGrowl2.play();
                timeToGrowl = MIN_TIME_TO_GROWL + MEDIAN_TIME_TO_GROWL * Math.random();
            }

            position.x += Math.round(velocity.x * deltaTime / 1000);
            velocity.y += Math.round(GRAVITY * deltaTime / 1000);
            position.y += Math.round(velocity.y * deltaTime / 1000); 

            if(player.getPosition().x < position.x) {
                flipped = true;
            } else {
                flipped = false;
            }
        }

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const moveLeft = function() {
        position.x -= 10;
    };

    const moveRight = function() {
        position.x += 10;
    };

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
//            currentAnimation = animations.jumping;
            console.log("Enemy Alien Guard is trying to jump.");
        }
    };

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
            console.log("Enemy Alien Guard is trying to block.");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    };

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.getIsFinished())) {
            return;
        } else {
            console.log("Enemy Alien Guard is trying to attack.");
//            currentAnimation = animations.attacking;
        }
    };

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("Enemy Alien Guard is crouching now.");
            isCrouching = true;
//            currentAnimation = animations.crouching;
        }
    };

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x, position.y - 3, flipped);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                position.x -= 5;
            } else {
                position.x += 5;
            }
        } else if(isPlayerTool(otherEntity) && otherEntity.isActive) {
            this.health--;

            if(this.health <= 0) {
                const healthDropChance = 100 * Math.random();
                if(healthDropChance < HEALTH_DROP_PROBABILITY) {
                    SceneState.scenes[SCENE.GAME].addHealthDrop(position.x, position.y);
                }
                SceneState.scenes[SCENE.GAME].removeMe(this);
            }

            flashTimer = 0;
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move player the full amount of the overlap
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                position.x += collisionData.deltaX;
            } else {
                position.y += collisionData.deltaY;
                if(collisionData.deltaY < 0) {
                    isOnGround = true;
                    velocity.y = 0;
                }
            }

            this.collisionBody.setPosition(position.x, position.y);
        }
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', enemyAlienGuardSheet, [0, 1], 23, 34, [512], false, true, [0], enemyAlienGuardBrightSheet);
        anims.idle.scale = SCALE;
//        animations.jumping = ...
//        animations.attacking = ...
//        animations.blocking = ...
//        animations.crouching = ...

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}