//BikerEnemy2.js
function BikerEnemy2(posX, posY) {
    const SCALE = GAME_SCALE;
    const WIDTH = 41;
	const ANIM_WIDTH = 41
    const HEIGHT = 33;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const MIN_TIME_TO_CACKLE = 1000;
    const MEDIAN_TIME_TO_CACLE = 500;
    const HEALTH_DROP_PROBABILITY = 30;
    const FLASH_TIME = 300; 
    const ATTACK_DIST = 28;
    const WALK_SPEED = 30;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    let timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
    
    let isAttacking = false;

    let flipped = false;

    let flashTimer = FLASH_TIME;

    this.type = EntityType.EnemyBiker2;
    this.dead = false;
    this.health = 7; //7 is minimum amount needed for two hits (1-6 = 1 HIT, 7-12 = 2 HITS, etc)

    this.collisionBody = new AABBCollider([
        {x:posX + 4, y:posY + 3}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 19, y:posY + 3}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 19, y:posY + HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 4, y:posY + HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
    ]);

    fist = new EnemyFist();

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

            timeToCackle -= deltaTime;
            if(timeToCackle <= 0) {
                bikerGrowl1.play();
                timeToCackle = MIN_TIME_TO_CACKLE + MEDIAN_TIME_TO_CACLE * Math.random();
            }

            const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);

            velocity.y += GRAVITY * deltaTime / 1000;
            if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
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
                if(!isAttacking) {
                    velocity.x = 0;
                    currentAnimation = animations.attacking;
                    currentAnimation.reset();
                    isAttacking = true;
                }
            }

            if((isAttacking) && (currentAnimation.getCurrentFrameIndex() === 3)) {
                fistIsActive = true;
                if(flipped) {
                    fist.activate(position.x - 5, position.y + 6);
                } else {
                    fist.activate(position.x + 5, position.y + 6);
                }
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

    this.draw = function(deltaTime) {
        if(this.collisionBody.isOnScreen) {
            if(currentAnimation === animations.death) {
                currentAnimation.drawAt(position.x, position.y + 4, flipped);
            } else {
                currentAnimation.drawAt(position.x - 12, position.y - 2, flipped);
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
            if(otherEntity.type === EntityType.Wheel) {
                this.health -= 0.2;
            } else {
                this.health--;
            }
            bikerHurt.play();
            if((this.health <= 0) && (currentAnimation !== animations.death)) {
                const healthDropChance = 100 * Math.random();
                this.dead = true;
                if(healthDropChance < 0.05) {
                    SceneState.scenes[SCENE.GAME].add1Up(position.x, position.y);
                } else if(healthDropChance < HEALTH_DROP_PROBABILITY) {
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

        anims.idle = new SpriteAnimation('idle', bikerEnemy2Sheet, [0, 1], ANIM_WIDTH, HEIGHT, [512], false, true, [0], bikerEnemy2BrightSheet);
		anims.attacking = new SpriteAnimation('attacking', bikerEnemy2Sheet, [2, 3, 4, 5, 6, 2], ANIM_WIDTH, HEIGHT, [100, 100, 400, 100, 330, 100], false, false, [0], bikerEnemy2BrightSheet);
		anims.death = new SpriteAnimation('death', deathSheet, [0, 1, 2, 3], 16, 16, [100], false, false);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}