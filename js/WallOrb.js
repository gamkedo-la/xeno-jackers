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
    const ATTACK_DELAY = 1500;
    const OFFSET = 32;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    
    let isAttacking = false;
    let bulletIsActive = false;
    let timeSinceAttack = Math.round(ATTACK_DELAY * Math.random());
    let didShoot = false;
    let flashTimer = FLASH_TIME;
    let totalOffset = 0;
    let didOffset1 = false;
    let didOffset2 = false;
    let offsetting = false;

    this.type = EntityType.WallOrb;
    this.dead = false;
    this.health = 49; //7 is minimum amount needed for two hits (1-6 = 1 HIT, 7-12 = 2 HITS, etc)

    this.collisionBody = new AABBCollider([
        {x:posX, y:posY},
        {x:posX + WIDTH, y:posY},
        {x:posX + WIDTH, y:posY + HEIGHT},
        {x:posX, y:posY + HEIGHT}
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

    this.offset = function() {
        offsetting = true;
        totalOffset++;
    }

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

            if(timeSinceAttack < ATTACK_DELAY) {
                timeSinceAttack += deltaTime;
            } else {
                timeSinceAttack = 0;
                SceneState.scenes[SCENE.GAME].addEnemyBullet(position.x - 11, position.y + 5, false);
            }

            if(offsetting) {
                if(totalOffset < OFFSET) {
                    totalOffset++;
                    if(totalOffset === OFFSET) {
                        offsetting = false;
                    }
                } else if(totalOffset < 2 * OFFSET) {
                    totalOffset++;
                    if(totalOffset === 2 * OFFSET) {
                        offsetting = false;
                    }
                }
            }

            position.y = posY + totalOffset;
        }

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.getIsFinished())) {
            return;
        } else {
            console.log("Biker Enemy is trying to attack.");
			currentAnimation = animations.attacking;
        }
    };

    this.draw = function(deltaTime) {
        if(this.collisionBody.isOnScreen) {
            if(currentAnimation === animations.death) {
                currentAnimation.drawAt(position.x, position.y, false);
            } else {
                currentAnimation.drawAt(position.x, position.y, false);
            }

            //colliders only draw when DRAW_COLLIDERS is set to true
            this.collisionBody.draw();
            fist.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(isPlayerTool(otherEntity) && otherEntity.isActive) {
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