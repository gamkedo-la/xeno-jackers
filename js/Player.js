//Player
function Player(startX, startY, hasChain, hasWheel, hasHandleBar, hasEngine) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const KNOCKBACK_YSPEED = -85;
    const MAX_JUMP_TIME = 170;
    const FRAME_WIDTH = 64; //old tile sheet = 24, new tile sheet = 64
    const FRAME_HEIGHT = 36;
    const SIZE = {width:FRAME_WIDTH, height:FRAME_HEIGHT};

    let currentAnimation;
    let position = {x:startX, y:startY};
    let velocity = {x:0, y:0};
    
    let isWalking = false;
    let isBlocking = false;
    let isCrouching = false;
    let isThumbUp = false;
    let isAttacking = false;

    let wasKnockedBack = false;
    let isOnGround = true;
    let wasOnGround = true;
    let heldJumpTime = 0;
    let lastJumpKeyTime = 0;
    let flipped = false;

    let levelWidth = 0;
    let levelHeight = 0;

    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.type = EntityType.Player;

	const pressedJumpKey = getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
	function releasedJumpKeyOrMaxedTimer(deltaTime) {
		return !pressedJumpKey() || heldJumpTime >= MAX_JUMP_TIME;
	}
	const fsm = new FSM(initial='idle');
	fsm.addState('idle', enterIdle, updateIdle, exitIdle);
	fsm.addState('walkingLeft', enterWalkingLeft, updateWalking, exitWalking);
	fsm.addState('walkingRight', enterWalkingRight, updateWalking, exitWalking);
	fsm.addState('jumping', enterJumping, updateJumping, exitJumping);
	fsm.addState('falling', enterFalling, updateFalling, exitFalling);
	fsm.addState('landing', enterLanding, updateLanding, exitLanding);
	fsm.addTransition('idle', 'walkingLeft', getExclusiveKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]));
	fsm.addTransition('idle', 'walkingRight', getExclusiveKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]));
	fsm.addTransition('walkingLeft', 'idle', releasedWalkKey);
	fsm.addTransition('walkingRight', 'idle', releasedWalkKey);
	fsm.addTransition('walkingLeft', 'walkingRight', getExclusiveKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]));
	fsm.addTransition('walkingRight', 'walkingLeft', getExclusiveKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]));
	fsm.addTransition('idle', 'jumping', pressedJumpKey);
	fsm.addTransition('jumping', 'falling', function() {
		return !pressedJumpKey || heldJumpTime >= MAX_JUMP_TIME;
	});
	fsm.addTransition('walkingLeft', 'jumping', getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]));
	fsm.addTransition('walkingRight', 'jumping', getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]));
	fsm.addTransition('falling', 'landing', collidedWithWalkable);
	fsm.addTransition('landing', 'idle', finishedLandingAnimation);

	function enterIdle(deltaTime) {
		if(currentAnimation !== animations.idle) {
            if(flipped) {
                colliderManager.setPointsForState(PlayerState.IdleRight, position);
            } else {
                colliderManager.setPointsForState(PlayerState.IdleLeft, position);
            }
        }
        currentAnimation = animations.idle;
        velocity.x = 0;
        isBlocking = false;
        isCrouching = false;
        isThumbUp = false;
        if(!isOnGround) {
            heldJumpTime = MAX_JUMP_TIME;
        }
	};

	function updateIdle(deltaTime) {
	}

	function exitIdle(deltaTime) {
	}

	function enterWalkingRight(deltaTime) {
		isWalking = true; // TODO: remove this line after all states are in the FSM
		velocity.x = WALK_SPEED;
		flipped = false;
		colliderManager.setPointsForState(PlayerState.WalkRight, position);
		currentAnimation = animations.walking;
	}

	function enterWalkingLeft(deltaTime) {
		isWalking = true; // TODO: remove this line after all states are in the FSM
		velocity.x = -WALK_SPEED;
		colliderManager.setPointsForState(PlayerState.WalkLeft, position);
        flipped = true;
		currentAnimation = animations.walking;
	}

	function updateWalking(deltaTime) {
		if(position.x < 0) {
            position.x = 0;
        }
		if(position.x + FRAME_WIDTH > levelWidth) {
            position.x = levelWidth;
        }
	}

	function exitWalking(deltaTime) {
		isWalking = false;
	}

	function pressedWalkKey() {
		return checkForPressedKeys([
			ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2,
			ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2,
		]);
	};

	function releasedWalkKey() {
		return !pressedWalkKey();
	}

	function enterJumping(deltaTime) {
		isOnGround = false;
		heldJumpTime = 0;
		if(flipped) {
            colliderManager.setPointsForState(PlayerState.JumpLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.JumpRight, position);
        }
		currentAnimation = animations.jumping;
        currentAnimation.reset();
	}

	function updateJumping(deltaTime) {
		velocity.y -= MAX_Y_SPEED / 10;
		heldJumpTime += deltaTime;
	}

	function exitJumping(deltaTime) {
	}

	function enterFalling(deltaTime) {
		if(flipped) {
            colliderManager.setPointsForState(PlayerState.FallingLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.FallingRight, position);
        }
		currentAnimation = animations.falling;
        currentAnimation.reset();
	}

	function updateFalling(deltaTime) {
	}

	function exitFalling(deltaTime) {
		isOnGround = true;
		heldJumpTime = 0;
	}

	function enterLanding(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.LandingLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.LandingRight, position);
        }
        currentAnimation = animations.landing;
        currentAnimation.reset();
	}

	function updateLanding(deltaTime) {
	}

	function exitLanding(deltaTime) {
	}

	function collidedWithWalkable(deltaTime) {
		return isOnGround;
	}

	function finishedLandingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.landing;
	}

    const colliderManager = new PlayerColliderManager(startX, startY, SIZE);
    this.collisionBody = new Collider(ColliderType.Polygon,
        [   {x:startX + 4, y:startY + 6}, //top left +2/+3 to make collision box smaller than sprite
            {x:startX + 17, y:startY + 6}, //top right +21/+3 makes collision box smaller than sprite
            {x:startX + 17, y:startY + FRAME_HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
            {x:startX + 4, y:startY + FRAME_HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
        ], {x:startX, y:startY});
    colliderManager.setBody(this.collisionBody);

    this.getPosition = function() {
        return {x:position.x, y:position.y};
    };

    this.setPosition = function(x, y) {
        position.x = x;
        position.y = y;
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.reset = function() {
        velocity.x = 0;
        velocity.y = 0;
        
        isBlocking = false;
        isCrouching = false;
        isThumbUp = false;
        isWalking = false;

        wasKnockedBack = false;
        isOnGround = true;
        heldJumpTime = 0;
        flipped = false;
    };

    this.getSize = function() {
        return SIZE;
    };

    this.update = function(deltaTime) {
        if(colliderManager.state === null) {
            colliderManager.setPointsForState(PlayerState.IdleRight, position);
        }

        currentAnimation.update(deltaTime);

        if(wasKnockedBack) {
            if(velocity.x > 0) {
                velocity.x -= 2;
            } else if(velocity.x < 0) {
                velocity.x += 2;
            }
        }
        position.x += Math.round(velocity.x * deltaTime / 1000);
        velocity.y += Math.round(GRAVITY * deltaTime / 1000);
        if(velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
        position.y += Math.round(velocity.y * deltaTime / 1000); 

        //console.log("Position Y", position.y);

        processInput(deltaTime, this.collisionBody);
		fsm.update(deltaTime);

        if(position.y > levelHeight) {
            this.health = 0;
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }
        
        //keep collisionBody in synch with sprite
//        updateCollisionBody(this.collisionBody);
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.newKeyPressed = function(newKey) {};

    this.setLevelWidth = function(newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function(newHeight) {
        levelHeight = newHeight;
    };

    const processInput = function(deltaTime, body) {
        let didRespond = false;
        const wasCrouching = isCrouching;
        isCrouching = false;

        for(let i = 0; i < heldButtons.length; i++) {
            switch(heldButtons[i]) {
                case ALIAS.WALK_LEFT:
                case ALIAS.WALK_LEFT2:
                    didRespond = true;
                    break;
                case ALIAS.WALK_RIGHT:
                case ALIAS.WALK_RIGHT2:
                    didRespond = true;
                    break;
                case ALIAS.JUMP:
                case ALIAS.JUMP2:
				    didRespond = didRespond || !isOnGround;
                    break;
                case ALIAS.BLOCK:
                    stillBlocking = true;
                    block();
                    didRespond = true;
                    break;
                case ALIAS.ATTACK:
                    attack();
                    didRespond = true;
                    break;
                case ALIAS.CROUCH:
                case ALIAS.CROUCH2:
                    crouch();
                    didRespond = true;
                    break;
                case ALIAS.THUMBUP:
                    thumbup();
                    didRespond = true;
                    break;
            }
        }

        if(!didRespond) {
            if((!wasKnockedBack) && (isOnGround)) {
                velocity.x = 0;
            }
        }
    };

    const block = function() {
        if(isOnGround && !isBlocking) {
            console.log("I'm blocking now");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    };

    const attack = function() {
        if(isOnGround && currentAnimation != animations.attacking) {
            isAttacking = true;
            velocity.x = 0;
            if(currentAnimation !== animations.attacking) {
                if(flipped) {
                    colliderManager.setPointsForState(PlayerState.AttackRight, position);
                } else {
                    colliderManager.setPointsForState(PlayerState.AttackLeft, position);
                }
            }
            currentAnimation = animations.attacking;
            currentAnimation.reset();
        }
    };

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            isCrouching = true;
            velocity.x = 0;
            if(currentAnimation !== animations.idle) {
                if(flipped) {
                    colliderManager.setPointsForState(PlayerState.CrouchRight, position);
                } else {
                    colliderManager.setPointsForState(PlayerState.CrouchLeft, position);
                }
            }
            currentAnimation = animations.crouching;
        }
    };

    const thumbup = function() {
        if (isWalking) return;

        if(isOnGround && currentAnimation != animations.thumbup) {
            isThumbUp = true;
            velocity.x = 0;
            if(currentAnimation !== animations.thumbup) {
                if(flipped) {
                    colliderManager.setPointsForState(PlayerState.Thumb, position);
                } else {
                    colliderManager.setPointsForState(PlayerState.Thumb, position);
                }
            }
            currentAnimation = animations.thumbup;
            currentAnimation.reset();
        }
    };

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x + (startX - canvas.center.x), position.y + (startY - canvas.center.y), flipped, -11);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(isEnemy(otherEntity)) {
            this.health--;

            if(this.health <= 0) {
                SceneState.scenes[SCENE.GAME].removeMe(this);
                //play death sound here?
                return;
            } else {
                hurt1.play();
            }

            wasKnockedBack = true;

            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                velocity.x = -KNOCKBACK_SPEED;
            } else {
                velocity.x = KNOCKBACK_SPEED;
            }

            velocity.y = KNOCKBACK_YSPEED;

        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move player the full amount of the overlap
            if(velocity.y > 0) {
                wasKnockedBack = false;
            }

            if(dotProduct(velocity, {x:collisionData.x, y:collisionData.y}) > 0) {
                return;
            }
            position.x += Math.ceil(collisionData.magnitude * collisionData.x);
            if(Math.abs(collisionData.x) > 0.01) velocity.x = 0;
            position.y += Math.ceil(collisionData.magnitude * collisionData.y);
            if((Math.abs(collisionData.y) > 0.01) && (velocity.y > 0)) velocity.y = 0;
            colliderManager.updateCollider(position.x, position.y);
//            updateCollisionBody(this.collisionBody);
            
            if(collisionData.y < -0.1) {
                isOnGround = true;
            } 
        } else if(isPickup(otherEntity)) {
            switch(otherEntity.type) {
                case EntityType.Health:
                    playerPickup1.play();
                    this.health += otherEntity.health;
                    if(this.health > this.maxHealth) this.health = this.maxHealth;
                    break;
                case EntityType.ChainPickup:
                    playerPickup2.play();
                    hasChain = true;
                    SceneState.scenes[SCENE.GAME].gotChain();
                    break;
                case EntityType.HandlebarPickup:
                    playerPickup2.play();
                    hasHandleBar = true;
                    SceneState.scenes[SCENE.GAME].gotHandlebar();
                    break;
                case EntityType.WheelPickup:
                    playerPickup2.play();
                    hasWheel = true;
                    SceneState.scenes[SCENE.GAME].gotWheel();
                    break;
                case EntityType.EnginePickup:
                    playerPickup2.play();
                    hasEngine = true;
                    SceneState.scenes[SCENE.GAME].gotEngine();
                    break;
            }
        }
    };

/*    const updateCollisionBody = function(body) {
        body.setPosition(//this is complicated because the player moves the camera/canvas
            position.x + (startX - canvas.center.x), 
            position.y + (startY - canvas.center.y)
        );
    };*/

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [4, 5, 6, 7], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true);
        anims.walking.scale = SCALE;
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [9], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.landing = new SpriteAnimation('land', playerSpriteSheet, [11, 12, 13], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 60], false, false);
        anims.attacking = new SpriteAnimation('attack', playerSpriteSheet, [20, 21, 22], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false);
//        anims.blocking = ...
        anims.crouching = new SpriteAnimation('crouch', playerSpriteSheet, [14], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
	    anims.thumbup = new SpriteAnimation('thumbup', playerSpriteSheet, [15, 16, 17, 18, 19], FRAME_WIDTH, FRAME_HEIGHT, [100, 100, 100, 100, 400], false, false);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;

    const isHoldingLeft = function() {
        for(let i = 0; i < heldButtons.length; i++) {
            if(heldButtons[i] === ALIAS.WALK_LEFT) {
                return true;
            } else if(heldButtons[i] === ALIAS.WALK_RIGHT) {
                return true;
            }
        }

        return false;
    };
}
