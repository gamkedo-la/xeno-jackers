//Player
function Player(startX, startY, hasChain, hasWheel, hasHandleBar, hasEngine) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const KNOCKBACK_YSPEED = -85;
    const MAX_JUMP_TIME = 320;//320 - how long you can hold the jump key and still go up
    const FRAME_WIDTH = 83; //old tile sheet = 24, then = 64, now 83
    const FRAME_HEIGHT = 36;
    const SIZE = { width: FRAME_WIDTH, height: FRAME_HEIGHT };

    let currentAnimation;
    let position = {x:startX, y:startY};
    let spawn = {x:0, y:0};
    let drawPosition = {x:0, y:0};
    let velocity = {x:0, y:0};

    let isBlocking = false;
    let isAttacking = false;
    let isAttackCrouch = false;

    let isOnGround = true;
    let wasOnGround = true;
    let heldJumpTime = 0;
    let lastJumpKeyTime = 0;
    let flipped = false;
	let didCollideWithEnvironment = false;
	let didCollideWithEnemy = false;
	let lastCollidedEnemy = null;
    let justCollidedWithEnvironment = false;
    const self = this;

    let levelWidth = 0;
    let levelHeight = 0;

    this.maxHealth = 10;
    this.health = this.maxHealth / 2;
    this.type = EntityType.Player;

    let chain = new ChainWhip();

    const pressedJumpKey = getNewKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
    const heldJumpKey = getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
	function releasedJumpKeyOrMaxedTimer(deltaTime) {
		return !heldJumpKey() || heldJumpTime >= MAX_JUMP_TIME;
	}
	const pressedCrouchKey = getKeyChecker([ALIAS.CROUCH, ALIAS.CROUCH2]);
	function releasedCrouchKey() {
		return !pressedCrouchKey();
    }
    
    const pressedAttackKey = getNewKeyChecker([ALIAS.ATTACK]);
    const canAttack = function() {
        return (hasChain && pressedAttackKey());
    };

	const pressedWalkLeftKey = getExclusiveKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]);
	const pressedWalkRightKey = getExclusiveKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]);
	function pressedWalkKey() {
		return checkForPressedKeys([
			ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2,
			ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2,
		]);
	};
	function releasedWalkKey() {
		return !pressedWalkKey();
	}

	this.fsm = new FSM(initial=PlayerState.IdleRight);
	// fsm.addState takes the state id, enter state function, update state function, and exit state function
	this.fsm.addState(PlayerState.IdleLeft, enterIdle, doNothing, doNothing);
	this.fsm.addState(PlayerState.IdleRight, enterIdle, doNothing, doNothing);
	this.fsm.addState(PlayerState.WalkLeft, enterWalkingLeft, updateWalking, doNothing);
	this.fsm.addState(PlayerState.WalkRight, enterWalkingRight, updateWalking, doNothing);
	this.fsm.addState(PlayerState.JumpLeft, enterJumping, updateJumping, doNothing);
	this.fsm.addState(PlayerState.JumpRight, enterJumping, updateJumping, doNothing);
	this.fsm.addState(PlayerState.FallingLeft, enterFalling, updateFalling, exitFalling);
	this.fsm.addState(PlayerState.FallingRight, enterFalling, updateFalling, exitFalling);
	this.fsm.addState(PlayerState.LandingLeft, enterLanding, doNothing, doNothing);
	this.fsm.addState(PlayerState.LandingRight, enterLanding, doNothing, doNothing);
	this.fsm.addState(PlayerState.CrouchLeft, enterCrouchingLeft, doNothing, doNothing);
	this.fsm.addState(PlayerState.CrouchRight, enterCrouchingRight, doNothing, doNothing);
	this.fsm.addState(PlayerState.KnockBack, enterKnockBack, updateKnockBack, exitKnockBack);
	this.fsm.addState(PlayerState.Hurt, enterGettingHurt, doNothing, doNothing);
	this.fsm.addState(PlayerState.Dead, enterDead, doNothing, doNothing);
	this.fsm.addState(PlayerState.Thumb, enterThumbUp, doNothing, doNothing);
	this.fsm.addState(PlayerState.AttackLeft, enterAttacking, updateAttacking, exitAttacking);
	this.fsm.addState(PlayerState.AttackRight, enterAttacking, updateAttacking, exitAttacking);
	this.fsm.addState(PlayerState.CrouchAttackLeft, enterCrouchAttacking, updateCrouchAttacking, exitCrouchAttacking);
	this.fsm.addState(PlayerState.CrouchAttackRight, enterCrouchAttacking, updateCrouchAttacking, exitCrouchAttacking);

	// fsm.addTransition takes a list of FROM states, the state to switch from any of those states, and a function that will return true or false, indicating whether the transition will happen or not
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.WalkLeft, pressedWalkLeftKey);
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.WalkRight, pressedWalkRightKey);
	this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.IdleLeft, releasedWalkKey);
	this.fsm.addTransition([PlayerState.WalkRight], PlayerState.IdleRight, releasedWalkKey);
	this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.WalkRight, pressedWalkRightKey);
	this.fsm.addTransition([PlayerState.WalkRight], PlayerState.WalkLeft, pressedWalkLeftKey);
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.WalkLeft], PlayerState.JumpLeft, pressedJumpKey);
	this.fsm.addTransition([PlayerState.IdleRight, PlayerState.WalkRight], PlayerState.JumpRight, pressedJumpKey);
	this.fsm.addTransition([PlayerState.JumpLeft], PlayerState.FallingLeft, releasedJumpKeyOrMaxedTimer);
	this.fsm.addTransition([PlayerState.JumpRight], PlayerState.FallingRight, releasedJumpKeyOrMaxedTimer);
	this.fsm.addTransition([PlayerState.FallingLeft], PlayerState.LandingLeft, collidedWithWalkable);
	this.fsm.addTransition([PlayerState.FallingRight], PlayerState.LandingRight, collidedWithWalkable);
	this.fsm.addTransition([PlayerState.LandingLeft], PlayerState.IdleLeft, finishedLandingAnimation);
    this.fsm.addTransition([PlayerState.LandingRight], PlayerState.IdleRight, finishedLandingAnimation);
    this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.CrouchLeft, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.WalkRight], PlayerState.CrouchRight, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.LandingLeft], PlayerState.CrouchLeft, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.LandingRight], PlayerState.CrouchRight, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.IdleLeft], PlayerState.CrouchLeft, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.IdleRight], PlayerState.CrouchRight, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.CrouchLeft], PlayerState.CrouchRight, getKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]));
	this.fsm.addTransition([PlayerState.CrouchRight], PlayerState.CrouchLeft, getKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]));
	this.fsm.addTransition([PlayerState.CrouchLeft], PlayerState.IdleLeft, releasedCrouchKey);
    this.fsm.addTransition([PlayerState.CrouchRight], PlayerState.IdleRight, releasedCrouchKey);
	this.fsm.addTransition([PlayerState.CrouchLeft], PlayerState.CrouchAttackLeft, canAttack);
    this.fsm.addTransition([PlayerState.CrouchRight], PlayerState.CrouchAttackRight, canAttack);
	this.fsm.addTransition([PlayerState.CrouchAttackLeft], PlayerState.CrouchLeft, finishedCrouchAttackAnimation);
    this.fsm.addTransition([PlayerState.CrouchAttackRight], PlayerState.CrouchRight, finishedCrouchAttackAnimation);
	this.fsm.addTransition([
		PlayerState.IdleLeft,
		PlayerState.IdleRight,
		PlayerState.WalkLeft,
		PlayerState.WalkRight,
		PlayerState.JumpLeft,
		PlayerState.JumpRight,
		PlayerState.FallingLeft,
		PlayerState.FallingRight,
		PlayerState.LandingLeft,
		PlayerState.LandingRight,
		PlayerState.CrouchLeft,
		PlayerState.CrouchRight,
        PlayerState.Thumb,
        PlayerState.AttackLeft,
        PlayerState.AttackRight,
	], PlayerState.Hurt, collidedWithEnemy);
	this.fsm.addTransition([PlayerState.Hurt], PlayerState.Dead, healthDepleted);
	this.fsm.addTransition([PlayerState.Hurt], PlayerState.KnockBack, healthRemaining);
	this.fsm.addTransition([PlayerState.KnockBack], PlayerState.IdleLeft, collidedWithEnvironmentWhileFallingLeft);
	this.fsm.addTransition([PlayerState.KnockBack], PlayerState.IdleRight, collidedWithEnvironmentWhileFallingRight);
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.Thumb, getKeyChecker([ALIAS.THUMBUP]));
	this.fsm.addTransition([PlayerState.Thumb], PlayerState.IdleLeft, finishedThumbUpAnimation); // Not adding thumb->IdleRight transition to avoid conflicting condition
	this.fsm.addTransition([PlayerState.AttackLeft], PlayerState.IdleLeft, finishedAttackingAnimation);
	this.fsm.addTransition([PlayerState.AttackRight], PlayerState.IdleRight, finishedAttackingAnimation);
    this.fsm.addTransition([PlayerState.WalkLeft, PlayerState.IdleLeft], PlayerState.AttackLeft, canAttack);
    this.fsm.addTransition([PlayerState.WalkRight, PlayerState.IdleRight], PlayerState.AttackRight, canAttack);

	function doNothing(deltaTime) {}

	function enterIdle(deltaTime) {
		lastCollidedEnemy = null;
		if(currentAnimation !== animations.idle) {
            if(flipped) {
                colliderManager.setPointsForState(PlayerState.IdleRight, position);
            } else {
                colliderManager.setPointsForState(PlayerState.IdleLeft, position);
            }
            colliderManager.updateCollider(position.x, position.y);
        }
        currentAnimation = animations.idle;
        velocity.x = 0;
        isBlocking = false;
        if(!isOnGround) {
            heldJumpTime = MAX_JUMP_TIME;
        }
	};

	function enterWalkingRight(deltaTime) {
		velocity.x = WALK_SPEED;
		flipped = false;
        colliderManager.setPointsForState(PlayerState.WalkRight, position);
        colliderManager.updateCollider(position.x, position.y);
		currentAnimation = animations.walking;
	}

	function enterWalkingLeft(deltaTime) {
		velocity.x = -WALK_SPEED;
        colliderManager.setPointsForState(PlayerState.WalkLeft, position);
        colliderManager.updateCollider(position.x, position.y);
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

	function enterJumping(deltaTime) {
		isOnGround = false;
		heldJumpTime = 0;
		if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
            colliderManager.setPointsForState(PlayerState.JumpRight, position);
            colliderManager.updateCollider(position.x, position.y);
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
            colliderManager.setPointsForState(PlayerState.JumpLeft, position);
            colliderManager.updateCollider(position.x, position.y);
        }

        velocity.y = -MAX_Y_SPEED;

		currentAnimation = animations.jumping;
        currentAnimation.reset();
		playerJump.play();
	}

	function updateJumping(deltaTime) {
		velocity.y = -MAX_Y_SPEED;
        heldJumpTime += deltaTime;
        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
            colliderManager.setPointsForState(PlayerState.JumpRight, position);
            colliderManager.updateCollider(position.x, position.y);
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
            colliderManager.setPointsForState(PlayerState.JumpLeft, position);
            colliderManager.updateCollider(position.x, position.y);
        }
	}

	function enterFalling(deltaTime) {
        if(velocity.y < 0) velocity.y = 0;

		if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
            colliderManager.setPointsForState(PlayerState.FallingRight, position);
            colliderManager.updateCollider(position.x, position.y);
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
            colliderManager.setPointsForState(PlayerState.FallingLeft, position);
            colliderManager.updateCollider(position.x, position.y);
        }
		currentAnimation = animations.falling;
        currentAnimation.reset();
    }
    
    function updateFalling(deltaTime) {
        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
            colliderManager.setPointsForState(PlayerState.FallingRight, position);
            colliderManager.updateCollider(position.x, position.y);
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
            colliderManager.setPointsForState(PlayerState.FallingLeft, position);
            colliderManager.updateCollider(position.x, position.y);
        }
    };

	function exitFalling(deltaTime) {
		heldJumpTime = 0;
		velocity.x = 0;
	}

	function enterLanding(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.LandingLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.LandingRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        currentAnimation = animations.landing;
        currentAnimation.reset();
    }
    
    function enterAttacking(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.AttackLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.AttackRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        velocity.x = 0;
        isAttacking = true;
        currentAnimation = animations.attacking;
        currentAnimation.reset();
    }

    function updateAttacking(deltaTime) {
        if(currentAnimation.getCurrentFrameIndex() === 2) {
            if(flipped) {
                chain.activate(position.x + FRAME_WIDTH -28, position.y + 5); // chain collision box anchor - attackLEFT
            } else {
                chain.activate(position.x + FRAME_WIDTH, position.y + 5); // chain collision box anchor - attackRIGHT
            }
        }
    }

    function exitAttacking(deltaTime) {
        chain.deactivate();
    }

    function enterCrouchAttacking(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.CrouchLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.CrouchRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        velocity.x = 0;
        isAttacking = true;
        currentAnimation = animations.attackcrouch;
        currentAnimation.reset();
    }

    function updateCrouchAttacking(deltaTime) {
        if(currentAnimation.getCurrentFrameIndex() === 2) {
            if(flipped) {
                chain.activate(position.x + FRAME_WIDTH -28, position.y + 12); 
            } else {
                chain.activate(position.x + FRAME_WIDTH, position.y + 12);
            }
        }
    }

    function exitCrouchAttacking(deltaTime) {
        chain.deactivate();
    }

    function finishedAttackingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.attacking;
    }
    
    function finishedCrouchAttackAnimation(deltaTime) {
        return currentAnimation.getIsFinished() || currentAnimation != animations.attackcrouch;
    }

	function collidedWithWalkable(deltaTime) {
		return isOnGround;
	}

	function finishedLandingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.landing;
	}

	function enterCrouching(deltaTime) {
		velocity.x = 0;
        currentAnimation = animations.crouching;
	}

	function enterCrouchingLeft(deltaTime) {
		enterCrouching(deltaTime);
		flipped = true;
	}

	function enterCrouchingRight(deltaTime) {
		enterCrouching(deltaTime);
		flipped = false;
	}

	function collidedWithEnemy(deltaTime) {
		return lastCollidedEnemy !== null;
	}

	function collidedWithEnvironmentWhileFalling(deltaTime) {
		return justCollidedWithEnvironment && velocity.y > 0;
	}

	function collidedWithEnvironmentWhileFallingLeft(deltaTime) {
		return collidedWithEnvironmentWhileFalling(deltaTime) && velocity.x <= 0;
	}

	function collidedWithEnvironmentWhileFallingRight(deltaTime) {
		return collidedWithEnvironmentWhileFalling(deltaTime) && velocity.x >= 0;
	}

	function healthDepleted(deltaTime) {
		return self.health <= 0;
	}

	function healthRemaining(deltaTime) {
		return !healthDepleted(deltaTime);
	}

	function enterGettingHurt(deltaTime) {
		self.health--;
		hurt1.play();
	}

	function enterDead(deltaTime) {
        // Play death animation?
		SceneState.scenes[SCENE.GAME].removeMe(self);
		//play death sound here?
	}

	function enterKnockBack(deltaTime) {
		if (lastCollidedEnemy.collisionBody.center.x >= self.collisionBody.center.x) {
            velocity.x = -KNOCKBACK_SPEED;
        } else {
            velocity.x = KNOCKBACK_SPEED;
        }
        velocity.y = KNOCKBACK_YSPEED;

        if (flipped) {
            colliderManager.setPointsForState(PlayerState.KnockBackLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.KnockBackRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        
        currentAnimation = animations.knockback;
	}

	function updateKnockBack(deltaTime) {
        if (velocity.x > 0) {
            velocity.x -= 2;
        } else if (velocity.x < 0) {
            velocity.x += 2;
        }
	}

	function exitKnockBack(deltaTime) {
		velocity.x = 0;
		lastCollidedEnemy = null;
	}

	function enterThumbUp(deltaTime) {
		velocity.x = 0;
        if (currentAnimation !== animations.thumbup) {
            if (flipped) {
                colliderManager.setPointsForState(PlayerState.Thumb, position);
            } else {
                colliderManager.setPointsForState(PlayerState.Thumb, position);
            }
            colliderManager.updateCollider(position.x, position.y);
        }
        currentAnimation = animations.thumbup;
        currentAnimation.reset();
	}

	function finishedThumbUpAnimation() {
		return currentAnimation == animations.thumbup && currentAnimation.getIsFinished();
	}

    const colliderManager = new PlayerColliderManager(startX, startY, SIZE);
    this.collisionBody = new AABBCollider([
        { x: startX + 10, y: startY + 6 }, //top left +10/+6 to make collision box smaller than sprite
        { x: startX + 23, y: startY + 6 }, //top right +23/+6 makes collision box smaller than sprite
        { x: startX + 23, y: startY + FRAME_HEIGHT }, //bottom right +23/+32 makes collision box smaller than sprite
        { x: startX + 10, y: startY + FRAME_HEIGHT } //bottom left +10/+32 makes collision box smaller than sprite
    ]);
    colliderManager.setBody(this.collisionBody);
    const collBody = this.collisionBody;

    this.getPosition = function () {
        return { x: position.x, y: position.y };
    };

    this.setSpawnPoint = function(x, y) {
        spawn.x = x - canvas.width / 2;
        spawn.y = y - canvas.height / 2;
        position.x = x;
        position.y = y;
        drawPosition.x = position.x - spawn.x - 26;
        drawPosition.y = position.y - spawn.y + 2;
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        drawPosition.x = position.x - spawn.x - 26 - canvas.offsetX;
        drawPosition.y = position.y - spawn.y + 2 - canvas.offsetY;
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.reset = function () {
        velocity.x = 0;
        velocity.y = 0;

        isBlocking = false;

        isOnGround = true;
        heldJumpTime = 0;
        flipped = false;
    };

    this.getSize = function () {
        return SIZE;
    };

    this.getDrawPosition = function() {
        return drawPosition;
    };

    this.update = function (deltaTime) {
        if (colliderManager.state === null) {
            colliderManager.setPointsForState(PlayerState.IdleRight, position);
        }

        justCollidedWithEnvironment = false;

        currentAnimation.update(deltaTime);

        const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);

        velocity.y += GRAVITY * deltaTime / 1000;
        if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
        const yPos = position.y + Math.round(velocity.y * deltaTime / 1000);

        this.setPosition(xPos, yPos);

        processInput(deltaTime, this.collisionBody);
        if (position.y > levelHeight) {
            this.health = 0;
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }

        //keep collisionBody in synch with sprite
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.newKeyPressed = function(newKey) {};

    this.setLevelWidth = function (newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function (newHeight) {
        levelHeight = newHeight;
    };

    const processInput = function (deltaTime, body) {
        for (let i = 0; i < heldButtons.length; i++) {
            switch (heldButtons[i]) {
                case ALIAS.BLOCK:
                    stillBlocking = true;
                    block();
                    break;
                case ALIAS.ATTACK:
//                    attack();
                    break;
            }
        }

    };

    const block = function () {
        if (isOnGround && !isBlocking) {
            console.log("I'm blocking now");
            isBlocking = true;
            //currentAnimation = animations.blocking;
        }
    };

    const attack = function () {
        if (isOnGround && currentAnimation != animations.attacking) {
            isAttacking = true;
            velocity.x = 0;
            if (currentAnimation !== animations.attacking) {
                if (flipped) {
                    colliderManager.setPointsForState(PlayerState.AttackRight, position);
                } else {
                    colliderManager.setPointsForState(PlayerState.AttackLeft, position);
                }
                colliderManager.updateCollider(position.x, position.y);
            }
            currentAnimation = animations.attacking;
            currentAnimation.reset();
        }
    };

    this.draw = function (deltaTime) {
        currentAnimation.drawAt(drawPosition.x, drawPosition.y - canvas.deltaY, flipped, 0);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
        chain.draw();
    };

    this.didCollideWith = function (otherEntity, collisionData) {
		if (isEnemy(otherEntity)) {
            lastCollidedEnemy = otherEntity;
		} else if (isEnvironment(otherEntity)) {
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                this.setPosition(position.x + collisionData.deltaX, position.y);
            } else {
                this.setPosition(position.x, position.y + collisionData.deltaY);
                if(collisionData.deltaY < 0) {
                    isOnGround = true;
                }
            }

			justCollidedWithEnvironment = true;
        } else if(isPickup(otherEntity)) {
            switch (otherEntity.type) {
                case EntityType.Health:
                    playerPickup1.play();
                    this.health += otherEntity.health;
                    if (this.health > this.maxHealth) this.health = this.maxHealth;
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
                case EpntityType.EnginePickup:
                    playerPickup2.play();
                    hasEngine = true;
                    SceneState.scenes[SCENE.GAME].gotEngine();
                    break;
            }
        }
    };

    const initializeAnimations = function () {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true, [8, 8, 8, 8]);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [4, 5, 6, 7], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true);
        anims.walking.scale = SCALE;
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [9], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.landing = new SpriteAnimation('land', playerSpriteSheet, [11, 12, 13], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 60], false, false);
        anims.attacking = new SpriteAnimation('attack', playerSpriteSheet, [20, 21, 22], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false);
        anims.attackcrouch = new SpriteAnimation('attackcrouch', playerSpriteSheet, [23, 24, 25], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false);
        //anims.attackjump = new SpriteAnimation('attackjump', playerSpriteSheet, [26, 27, 28], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false);
        //        anims.blocking = ...
        anims.crouching = new SpriteAnimation('crouch', playerSpriteSheet, [14], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.thumbup = new SpriteAnimation('thumbup', playerSpriteSheet, [15, 16, 17, 18, 19], FRAME_WIDTH, FRAME_HEIGHT, [100, 100, 100, 100, 400], false, false);
        anims.knockback = new SpriteAnimation('knockedback', playerSpriteSheet, [12], FRAME_WIDTH, FRAME_HEIGHT, [125], false, false);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;

    const isHoldingLeft = function () {
        for (let i = 0; i < heldButtons.length; i++) {
            if (heldButtons[i] === ALIAS.WALK_LEFT) {
                return true;
            } else if (heldButtons[i] === ALIAS.WALK_RIGHT) {
                return true;
            }
        }

        return false;
    };
}
