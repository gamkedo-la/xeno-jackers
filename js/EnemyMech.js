
function EnemyMech(startX, startY) {
    const WIDTH = 36;
    const HEIGHT = 36;
    const MELEE_ATTACK_DIST = 28;
    const RANGE_ATTACK_DIST = 60;
    const FLASH_TIME = 300; 

    let flipped = false;
    let flashTimer = FLASH_TIME;
    let position = {x: startX,y: startY};
    let velocity = {x: 0, y: 0};
    let anims = {
        idle: new SpriteAnimation('idle', enemyMechSpriteSheet, [0,1,2,3,4,5,6,7,8,9], WIDTH, HEIGHT, [100], false, true, [0], enemyMechSpriteBrightSheet),
        punch: new SpriteAnimation('punch', enemyMechSpriteSheet, [10,11,12,13,14,15,16], WIDTH, HEIGHT, [100], false, true, [0], enemyMechSpriteBrightSheet),
        shoot: new SpriteAnimation('shoot', enemyMechSpriteSheet, [10,11,12,13], WIDTH, HEIGHT, [100], false, false, [0], enemyMechSpriteBrightSheet),
    };
    let currentAnimation = anims.idle;
    let phase1Complete = false;
    let phase2Complete = false;
    let isPunching = false;
    let fistIsActive = false;
    let isShooting = false;

    fist = new EnemyFist();

    const MAX_HEALTH = 100;
    this.health = MAX_HEALTH;
    this.type = EntityType.EnemyMech;
    this.collisionBody = new AABBCollider([
        {x:startX + 2, y:startY + 3},
        {x:startX + 18, y:startY + 3},
        {x:startX + 18, y:startY + HEIGHT},
        {x:startX + 2, y:startY + HEIGHT}
    ]);

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function (deltaTime, player) {
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

            // play the animation
            currentAnimation.update(deltaTime);

            const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);

            velocity.y += GRAVITY * deltaTime / 1000;
            if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
            const yPos = position.y + Math.round(velocity.y * deltaTime / 1000);

            let distToPlayer = 0;
            if(player.collisionBody.center.x < this.collisionBody.center.x) {
                flipped = false;
                distToPlayer = this.collisionBody.center.x - player.collisionBody.center.x;
            } else {
                flipped = true;
                distToPlayer = player.collisionBody.center.x - this.collisionBody.center.x;
            }

            if(!phase1Complete) {
                checkPhase1Attack(distToPlayer);
            } else if(!phase2Complete) {
                checkPhase2Attack(distToPlayer);
            } else {
                checkPhase3Attack(distToPlayer);
            }
        }

        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const checkPhase1Attack = function(distToPlayer) {
        if(distToPlayer < MELEE_ATTACK_DIST) {
            if(!isPunching) {
                velocity.x = 0;
                currentAnimation = anims.punch;
                isPunching = true;
            }
        } else {
            currentAnimation = anims.idle;
            fist.deactivate();
            fistIsActive = false;
            isPunching = false;
        }

        if(isPunching) {
            const currentFrameIndex = currentAnimation.getCurrentFrameIndex();
            if((currentFrameIndex === 1) || (currentFrameIndex === 2) || (currentFrameIndex === 5)) {
                fistIsActive = true;
                if(flipped) {
                    fist.activate(position.x + 4, position.y + 13);
                } else {
                    fist.activate(position.x - 9, position.y + 13);
                }
            } else {
                fist.deactivate();
                fistIsActive = false;
            }
        }
    };

    const checkPhase2Attack = function(distToPlayer) {
        if(distToPlayer < MELEE_ATTACK_DIST - 3) {
            checkPhase1Attack(distToPlayer);
            return;
        } else if(distToPlayer < RANGE_ATTACK_DIST) {
            if(!isShooting) {
                velocity.x = 0;
                currentAnimation = anims.shoot;
                currentAnimation.reset();
                isShooting = true;
            }
        } else {
            currentAnimation = anims.idle;
            fist.deactivate();
            fistIsActive = false;
            isShooting = false;
        }

        if(isShooting) {
            const currentFrameIndex = currentAnimation.getCurrentFrameIndex();
            if((currentFrameIndex === 1) || (currentFrameIndex === 2)) {
                fistIsActive = true;
                if(flipped) {
                    fist.activate(position.x + 4, position.y + 13);
                } else {
                    fist.activate(position.x - 9, position.y + 13);
                }
            } else if(currentFrameIndex === 3) {
                if(currentAnimation.getIsFinished()) {
                    currentAnimation = anims.idle;
                }
                
                fist.deactivate();
                fistIsActive = false;
            } else {
                fist.deactivate();
                fistIsActive = false;
            }
        }
    };

    const checkPhase3Attack = function(distToPlayer) {

    };

    this.draw = function (deltaTime) {
        if(this.collisionBody.isOnScreen) {
            if(flipped) {
                currentAnimation.drawAt(position.x - 5, position.y - 2, flipped);
            } else {
                currentAnimation.drawAt(position.x - 15, position.y - 2, flipped);
            }
            
            this.collisionBody.draw();
            fist.draw();
        }        
    };

    this.didCollideWith = function(otherEntity) {
        if(otherEntity.type === EntityType.Player) {
            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                position.x -= 5;
            } else {
                position.x += 5;
            }
        } else if(isPlayerTool(otherEntity) && otherEntity.isActive) {
            this.health--;
            if(this.health < 2 * MAX_HEALTH / 3) {
                phase1Complete = true;
            } else if(this.health < MAX_HEALTH / 3) {
                phase2Complete = true;
            } else if(this.health <= 0) {
                SceneState.scenes[SCENE.GAME].mechDefeated(this);
            }
            flashTimer = 0;
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
}