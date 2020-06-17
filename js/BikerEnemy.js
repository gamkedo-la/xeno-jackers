//BikerEnemy.js
function BikerEnemy(posX, posY) {
    const SCALE = GAME_SCALE;
    const WIDTH = 23;
	const ANIM_WIDTH = 32
    const HEIGHT = 33;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const MIN_TIME_TO_CACKLE = 1000;
    const MEDIAN_TIME_TO_CACLE = 500;
    const HEALTH_DROP_PROBABILITY = 30;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    let timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
    let flipped = false;

    this.type = EntityType.EnemyBiker;
    this.health = 1;

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

        if(this.collisionBody.isOnScreen) {
            timeToCackle -= deltaTime;
            if(timeToCackle <= 0) {
                alienCackle1.play();
                timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
            }

            const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);

            velocity.y += GRAVITY * deltaTime / 1000;
            if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
            const yPos = position.y + Math.round(velocity.y * deltaTime / 1000);

            this.setPosition(xPos, yPos);

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
            console.log("Biker Enemy is trying to jump.");
        }
    };

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
            console.log("Biker Enemy is trying to block.");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    };

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.getIsFinished())) {
            return;
        } else {
            console.log("Biker Enemy is trying to attack.");
			currentAnimation = animations.attacking;
        }
    };

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("Biker Enemy is crouching now.");
            isCrouching = true;
//            currentAnimation = animations.crouching;
        }
    };

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x, position.y, flipped);

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
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move biker enemy the full amount of the overlap
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                this.setPosition(position.x + collisionData.deltaX, position.y);
            } else {
                this.setPosition(position.x, position.y + collisionData.deltaY);
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

        anims.idle = new SpriteAnimation('idle', bikerEnemySheet, [0, 1], ANIM_WIDTH, HEIGHT, [512], false, true);
        anims.idle.scale = SCALE;
		anims.attacking = new SpriteAnimation('attacking', bikerEnemySheet, [1, 2, 3, 4, 5, 0], ANIM_WIDTH, HEIGHT, [100, 100, 400, 100, 330, 100], false, true);
//        animations.jumping = ...
//        animations.blocking = ...
//        animations.crouching = ...

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}