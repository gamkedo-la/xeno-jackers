//WallOrb.js
//BikerEnemy2.js
function WallOrb(posX, posY) {
    const SCALE = GAME_SCALE;
    const WIDTH = 16;
	const ANIM_WIDTH = 16
    const HEIGHT = 16;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const HEALTH_DROP_PROBABILITY = 70;
    const FLASH_TIME = 300; 
    const ATTACK_DIST = 45;
    const ATTACK_DELAY = 200;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    
    let isAttacking = false;
    let bulletIsActive = false;
    let timeSinceAttack = ATTACK_DELAY;
    let didShoot = false;
    let flashTimer = FLASH_TIME;

    this.type = EntityType.WallOrb;
    this.dead = false;
    this.health = 49; //7 is minimum amount needed for two hits (1-6 = 1 HIT, 7-12 = 2 HITS, etc)

    this.collisionBody = new AABBCollider([
        {x:posX + 4, y:posY + 3}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 19, y:posY + 3}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 19, y:posY + HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 4, y:posY + HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
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

            let distToPlayer = 0;
            if(player.collisionBody.center.x < this.collisionBody.center.x) {
                distToPlayer = this.collisionBody.center.x - player.collisionBody.center.x;
            } else {
                distToPlayer = player.collisionBody.center.x - this.collisionBody.center.x;
            }

            if(distToPlayer < ATTACK_DIST) {
                if(!isAttacking) {
                    //TODO: Would like to have an animation for this
                    //currentAnimation = animations.attacking;
                    //currentAnimation.reset();
                    isAttacking = true;
                }
            } 

            if((isAttacking) && (currentAnimation.getCurrentFrameIndex() === 3)) {
                fistIsActive = true;
                fist.activate(position.x - 5, position.y + 6);
            } else if((isAttacking) && (currentAnimation.getCurrentFrameIndex() != 3)) {
                fist.deactivate();
                fistIsActive = false;
            }
            
            if((isAttacking) && (currentAnimation.getIsFinished())) {
                isAttacking = false;
                currentAnimation = animations.idle;
            }
        }


        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const moveLeft = function() {
        velocity.x = -WALK_SPEED;
    };

    const moveRight = function() {
        velocity.x = WALK_SPEED;
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
        if(this.collisionBody.isOnScreen) {
            if(currentAnimation === animations.death) {
                currentAnimation.drawAt(position.x, position.y + 4, false);
            } else {
                currentAnimation.drawAt(position.x - 12, position.y - 2, false);
            }

            //colliders only draw when DRAW_COLLIDERS is set to true
            this.collisionBody.draw();
            fist.draw();
        }
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
            if((this.health <= 0) && (currentAnimation !== animations.death)) {
                const healthDropChance = 100 * Math.random();
                this.dead = true;
                if(healthDropChance < HEALTH_DROP_PROBABILITY) {
                    SceneState.scenes[SCENE.GAME].addHealthDrop(position.x, position.y);
                }
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

        anims.idle = new SpriteAnimation('idle', wallOrbSheet, [0], ANIM_WIDTH, HEIGHT, [512], false, true, [0], wallOrbBrightSheet);
		anims.attacking = new SpriteAnimation('attacking', wallOrbSheet, [0], ANIM_WIDTH, HEIGHT, [100], false, false, [0], wallOrbBrightSheet);
		anims.death = new SpriteAnimation('death', deathSheet, [0, 1, 2, 3], 16, 16, [100], false, false);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}