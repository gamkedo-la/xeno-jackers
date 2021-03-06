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
    const FLASH_TIME = 300;

    let currentAnimation;
    let position = {x:startX, y:startY};
    let spawn = {x:0, y:0};
    let drawPosition = {x:0, y:0};
    let velocity = {x:0, y:0};

    let isOnGround = true;
    let heldJumpTime = 0;
    let flipped = false;
    let didHitRoad = false;
	let lastCollidedEnemy = null;
    let justCollidedWithEnvironment = false;
    let flashTimer = FLASH_TIME;
    const self = this;

    let levelWidth = 0;
    let levelHeight = 0;

    this.maxHealth = 10;
    this.health = this.maxHealth / 2;
    this.type = EntityType.Player;
    this.pogoedAnEnemy = false;

    let chain = new ChainWhip();
    let wheel = new Wheel();
    let handlebar = new Handlebar(this);

    const pressedJumpKey = getNewKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
    const heldJumpKey = getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
	function releasedJumpKeyOrMaxedTimer(deltaTime) {
		return !heldJumpKey() || heldJumpTime >= MAX_JUMP_TIME;
	}
	const pressedCrouchKey = getKeyChecker([ALIAS.CROUCH, ALIAS.CROUCH2]);
	function releasedCrouchKey() {
		return !pressedCrouchKey();
    }

    const intendsToCrouchLeft = function() {
        for(let i = heldButtons.length - 1; i >= 0; i--) {
            if(heldButtons[i] === ALIAS.WALK_LEFT) return true;
            if(heldButtons[i] === ALIAS.WALK_LEFT2) return true;
            if(heldButtons[i] === ALIAS.WALK_RIGHT) return false;
            if(heldButtons[i] === ALIAS.WALK_RIGHT2) return false;         
        }

        return false;
    }

    const intendsToCrouchRight = function() {
        for(let i = heldButtons.length - 1; i >= 0; i--) {
            if(heldButtons[i] === ALIAS.WALK_RIGHT) return true;
            if(heldButtons[i] === ALIAS.WALK_RIGHT2) return true;         
            if(heldButtons[i] === ALIAS.WALK_LEFT) return false;
            if(heldButtons[i] === ALIAS.WALK_LEFT2) return false;
        }

        return false;
    }

    const pressedThrowKey = getNewKeyChecker([KEY_X]);
    const canThrow = function() {
        return (hasWheel && pressedThrowKey());
    }

    const pressedAttackKey = getNewKeyChecker([ALIAS.ATTACK]);
    const canAttack = function() {
        return (hasChain && pressedAttackKey());
    };

    const pressedPogoKey = getKeyChecker([KEY_Z]);
    const canPogo = function() {
        return (hasHandleBar && pressedPogoKey());
    }

    const pogoedABadGuy = function() {
        return self.pogoedAnEnemy;
    }

    const pressedWalkLeftKey = getKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2], [ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]);
    const pressedWalkRightKey = getKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2], [ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]);
	function pressedWalkKey() {
		return checkForPressedKeys([
			ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2,
			ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2,
		]);
    };
    
	function releasedWalkKey() {
		return !pressedWalkKey();
    }
    
    function walkedOffLedge() {
        if(!justCollidedWithEnvironment && (velocity.y > 0)) {
            //didn't hit the ground recently
            isOnGround = false;
            if(pressedWalkLeftKey()) {
                flipped = true;
            } else if(pressedWalkRightKey()) {
                flipped = false;
            }
            currentAnimation = animations.falling;
            return true;
        }
        return false;
    };

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
	this.fsm.addState(PlayerState.CrouchLeft, enterCrouchingLeft, updateCrouching, exitCrouch);
	this.fsm.addState(PlayerState.CrouchRight, enterCrouchingRight, updateCrouching, exitCrouch);
	this.fsm.addState(PlayerState.KnockBack, enterKnockBack, updateKnockBack, exitKnockBack);
	this.fsm.addState(PlayerState.Hurt, enterGettingHurt, doNothing, doNothing);
	this.fsm.addState(PlayerState.Dead, enterDead, updateDead, exitDead);
	this.fsm.addState(PlayerState.Thumb, enterThumbUp, doNothing, doNothing);
	this.fsm.addState(PlayerState.AttackLeft, enterAttacking, updateAttacking, exitAttacking);
	this.fsm.addState(PlayerState.AttackRight, enterAttacking, updateAttacking, exitAttacking);
	this.fsm.addState(PlayerState.ThrowLeft, enterThrowing, updateThrowing, exitThrowing);
	this.fsm.addState(PlayerState.ThrowRight, enterThrowing, updateThrowing, exitThrowing);
	this.fsm.addState(PlayerState.CrouchAttackLeft, enterCrouchAttacking, updateCrouchAttacking, exitCrouchAttacking);
	this.fsm.addState(PlayerState.CrouchAttackRight, enterCrouchAttacking, updateCrouchAttacking, exitCrouchAttacking);
	this.fsm.addState(PlayerState.JumpAttackLeft, enterJumpAttacking, updateJumpAttacking, exitJumpAttacking);
	this.fsm.addState(PlayerState.JumpAttackRight, enterJumpAttacking, updateJumpAttacking, exitJumpAttacking);
	this.fsm.addState(PlayerState.FallAttackLeft, enterFallAttacking, updateFallAttacking, exitFallAttacking);
	this.fsm.addState(PlayerState.FallAttackRight, enterFallAttacking, updateFallAttacking, exitFallAttacking);
	this.fsm.addState(PlayerState.PogoJumpLeft, enterJumpPogo, updateJumpPogo, exitJumpPogo);
	this.fsm.addState(PlayerState.PogoJumpRight, enterJumpPogo, updateJumpPogo, exitJumpPogo);
	this.fsm.addState(PlayerState.PogoFallLeft, enterFallPogo, updateFallPogo, exitFallPogo);
	this.fsm.addState(PlayerState.PogoFallRight, enterFallPogo, updateFallPogo, exitFallPogo);

	// fsm.addTransition takes a list of FROM states, the state to switch from any of those states, and a function that will return true or false, indicating whether the transition will happen or not
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.WalkLeft, pressedWalkLeftKey);
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.WalkRight, pressedWalkRightKey);
	this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.IdleLeft, releasedWalkKey);
	this.fsm.addTransition([PlayerState.WalkRight], PlayerState.IdleRight, releasedWalkKey);
	this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.FallingLeft, walkedOffLedge);
	this.fsm.addTransition([PlayerState.WalkRight], PlayerState.FallingRight, walkedOffLedge);
	this.fsm.addTransition([PlayerState.IdleLeft], PlayerState.FallingLeft, walkedOffLedge);
	this.fsm.addTransition([PlayerState.IdleRight], PlayerState.FallingRight, walkedOffLedge);
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
	this.fsm.addTransition([PlayerState.LandingLeft], PlayerState.WalkLeft, pressedWalkLeftKey);
    this.fsm.addTransition([PlayerState.LandingRight], PlayerState.WalkRight, pressedWalkRightKey);
    this.fsm.addTransition([PlayerState.WalkLeft], PlayerState.CrouchLeft, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.WalkRight], PlayerState.CrouchRight, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.LandingLeft], PlayerState.CrouchLeft, pressedCrouchKey);
    this.fsm.addTransition([PlayerState.LandingRight], PlayerState.CrouchRight, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.IdleLeft], PlayerState.CrouchLeft, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.IdleRight], PlayerState.CrouchRight, pressedCrouchKey);
	this.fsm.addTransition([PlayerState.CrouchLeft], PlayerState.CrouchRight, intendsToCrouchRight);
	this.fsm.addTransition([PlayerState.CrouchRight], PlayerState.CrouchLeft, intendsToCrouchLeft);
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
	this.fsm.addTransition([PlayerState.KnockBack], PlayerState.IdleRight, collidedWithEnvironmentWhileFallingLeft);
	this.fsm.addTransition([PlayerState.KnockBack], PlayerState.IdleLeft, collidedWithEnvironmentWhileFallingRight);
	this.fsm.addTransition([PlayerState.Hurt], PlayerState.KnockBack, healthRemaining);
	this.fsm.addTransition([PlayerState.Dead], PlayerState.IdleRight, finishedDeathAnimation);
    this.fsm.addTransition([PlayerState.IdleRight, PlayerState.IdleLeft], PlayerState.Dead, healthDepleted);
	this.fsm.addTransition([PlayerState.IdleLeft, PlayerState.IdleRight], PlayerState.Thumb, getKeyChecker([ALIAS.THUMBUP]));
	this.fsm.addTransition([PlayerState.Thumb], PlayerState.IdleLeft, finishedThumbUpAnimation); // Not adding thumb->IdleRight transition to avoid conflicting condition
	this.fsm.addTransition([PlayerState.AttackLeft], PlayerState.IdleLeft, finishedAttackingAnimation);
	this.fsm.addTransition([PlayerState.AttackRight], PlayerState.IdleRight, finishedAttackingAnimation);
	this.fsm.addTransition([PlayerState.ThrowLeft], PlayerState.IdleLeft, finishedThrowingAnimation);
	this.fsm.addTransition([PlayerState.ThrowRight], PlayerState.IdleRight, finishedThrowingAnimation);
    this.fsm.addTransition([PlayerState.WalkLeft, PlayerState.IdleLeft], PlayerState.AttackLeft, canAttack);
    this.fsm.addTransition([PlayerState.WalkRight, PlayerState.IdleRight], PlayerState.AttackRight, canAttack);
    this.fsm.addTransition([PlayerState.WalkLeft, PlayerState.IdleLeft], PlayerState.ThrowLeft, canThrow);
    this.fsm.addTransition([PlayerState.WalkRight, PlayerState.IdleRight], PlayerState.ThrowRight, canThrow);
    this.fsm.addTransition([PlayerState.JumpRight], PlayerState.JumpAttackRight, canAttack);
    this.fsm.addTransition([PlayerState.JumpLeft], PlayerState.JumpAttackLeft, canAttack);
	this.fsm.addTransition([PlayerState.JumpAttackRight], PlayerState.FallAttackRight, releasedJumpKeyOrMaxedTimer);
    this.fsm.addTransition([PlayerState.JumpAttackLeft], PlayerState.FallAttackLeft, releasedJumpKeyOrMaxedTimer);
	this.fsm.addTransition([PlayerState.JumpAttackRight], PlayerState.JumpRight, finishedJumpAttackingAnimation);
    this.fsm.addTransition([PlayerState.JumpAttackLeft], PlayerState.JumpLeft, finishedJumpAttackingAnimation);
	this.fsm.addTransition([PlayerState.FallAttackRight], PlayerState.FallingRight, finishedJumpAttackingAnimation);
    this.fsm.addTransition([PlayerState.FallAttackLeft], PlayerState.FallingLeft, finishedJumpAttackingAnimation);
	this.fsm.addTransition([PlayerState.FallAttackRight], PlayerState.LandingRight, collidedWithWalkable);
    this.fsm.addTransition([PlayerState.FallAttackLeft], PlayerState.LandingLeft, collidedWithWalkable);
    this.fsm.addTransition([PlayerState.FallingRight], PlayerState.FallAttackRight, canAttack);
    this.fsm.addTransition([PlayerState.FallingLeft], PlayerState.FallAttackLeft, canAttack);
    this.fsm.addTransition([PlayerState.JumpRight], PlayerState.PogoJumpRight, canPogo);
    this.fsm.addTransition([PlayerState.JumpLeft], PlayerState.PogoJumpLeft, canPogo);
    this.fsm.addTransition([PlayerState.FallingRight], PlayerState.PogoFallRight, canPogo);
    this.fsm.addTransition([PlayerState.FallingLeft], PlayerState.PogoFallLeft, canPogo);
	this.fsm.addTransition([PlayerState.PogoJumpRight], PlayerState.PogoFallRight, releasedJumpKeyOrMaxedTimer);
    this.fsm.addTransition([PlayerState.PogoJumpLeft], PlayerState.PogoFallLeft, releasedJumpKeyOrMaxedTimer);
	this.fsm.addTransition([PlayerState.PogoFallRight], PlayerState.LandingRight, collidedWithWalkable);
    this.fsm.addTransition([PlayerState.PogoFallLeft], PlayerState.LandingLeft, collidedWithWalkable);
	this.fsm.addTransition([PlayerState.PogoJumpRight], PlayerState.PogoJumpRight, pogoedABadGuy);
    this.fsm.addTransition([PlayerState.PogoJumpLeft], PlayerState.PogoJumpLeft, pogoedABadGuy);
	this.fsm.addTransition([PlayerState.PogoFallRight], PlayerState.PogoJumpRight, pogoedABadGuy);
    this.fsm.addTransition([PlayerState.PogoFallLeft], PlayerState.PogoJumpLeft, pogoedABadGuy);

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
            position.x = levelWidth - FRAME_WIDTH;
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
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
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
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
        } else {
            velocity.x = 0;
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
        chainAttack1.play();
    }

    function updateAttacking(deltaTime) {
        if(currentAnimation.getCurrentFrameIndex() === 2) {
            if(flipped) {
                chain.activate(drawPosition.x + 0, drawPosition.y + 12);
            } else {
                chain.activate(drawPosition.x + 30, drawPosition.y + 12);
            }
        }
    }

    function exitAttacking(deltaTime) {
        chain.deactivate();
    }

    let crouchAdjustTime = 0;
    let crouchAttackY = 0;
    function enterCrouchAttacking(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.CrouchAttackLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.CrouchAttackRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        velocity.x = 0;
        isAttacking = true;
        currentAnimation = animations.attackcrouch;
        currentAnimation.reset();
        chainAttack2.play();
        crouchAdjustTime = 0;
        crouchAttackY = drawPosition.y;
    }

    function updateCrouchAttacking(deltaTime) {
        if(crouchAdjustTime < 20) {
            // Absolute total Hack, but can't figure out why
            //the crouch attack hop is occuring and this suppresses it
            drawPosition.y = crouchY;
            crouchAdjustTime += deltaTime;
        }
        if(currentAnimation.getCurrentFrameIndex() === 2) {
            if(flipped) {
                chain.activate(drawPosition.x + 4, drawPosition.y + 20);
            } else {
                chain.activate(drawPosition.x + 26, drawPosition.y + 20);
            }
        }
    }

    function exitCrouchAttacking(deltaTime) {
        chain.deactivate();
    }

    function enterJumpAttacking(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.JumpAttackLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.JumpAttackRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);

        currentAnimation = animations.attackjump;
        currentAnimation.reset();
		chainAttack1.play();
    }

    function updateJumpAttacking(deltaTime) {
        velocity.y = -MAX_Y_SPEED;
        heldJumpTime += deltaTime;

        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
        }

        if(flipped) {
            if(currentAnimation.getCurrentFrameIndex() === 2) chain.activate(drawPosition.x + 5, drawPosition.y + 15);
        } else {
            if(currentAnimation.getCurrentFrameIndex() === 2) chain.activate(drawPosition.x + 25, drawPosition.y + 15);
        }
    }

    function exitJumpAttacking(deltaTime) {
        chain.deactivate();
    }

    function enterFallAttacking(deltaTime) {
        if(velocity.y < 0) velocity.y = 0;//Prevent double jump by attacking?

        if(currentAnimation !== animations.attackjump) {
            if(flipped) {
                colliderManager.setPointsForState(PlayerState.JumpAttackLeft, position);
            } else {
                colliderManager.setPointsForState(PlayerState.JumpAttackRight, position);
            }
            colliderManager.updateCollider(position.x, position.y);
    
            currentAnimation = animations.attackjump;
            currentAnimation.reset();
            chainAttack1.play();
        }
    }

    function updateFallAttacking(deltaTime) {
        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
        }

        if(flipped) {
            if(currentAnimation.getCurrentFrameIndex() === 2) chain.activate(drawPosition.x + 5, drawPosition.y + 15);
        } else {
            if(currentAnimation.getCurrentFrameIndex() === 2) chain.activate(drawPosition.x + 25, drawPosition.y + 15);
        }
    }

    function exitFallAttacking(deltaTime) {
        chain.deactivate();
    }

    function enterThrowing(deltaTime) {
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.AttackLeft, position);//I think AttackLeft/Right will work
        } else {
            colliderManager.setPointsForState(PlayerState.AttackRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        velocity.x = 0;
        isAttacking = true;
        currentAnimation = animations.throwing;
        currentAnimation.reset();
    }

    function updateThrowing(deltaTime) {
        if(currentAnimation.getCurrentFrameIndex() === 2) {
            if(flipped) {
                wheel.activate(drawPosition.x + 15, drawPosition.y + 15, -3 * WALK_SPEED);
            } else {
                wheel.activate(drawPosition.x + 50, drawPosition.y + 15, 3 * WALK_SPEED);
            }
        }
    }

    function exitThrowing(deltaTime) {
        
    }

    function enterJumpPogo(deltaTime) {
        self.pogoedAnEnemy = false;
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

        handlebar.activate(self.collisionBody.center.x, self.collisionBody.center.y);//center at bottom of player sprite
        currentAnimation = animations.pogoJumping;
        currentAnimation.reset();
    }

    function updateJumpPogo(deltaTime) {
        heldJumpTime += deltaTime;
        velocity.y = -MAX_Y_SPEED;
        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
        }
    }

    function exitJumpPogo(deltaTime) {
    }

    function enterFallPogo(deltaTime) {
        if(velocity.y < 0) velocity.y = 0;
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

        if(!handlebar.isActive) {
            handlebar.activate(self.collisionBody.center.x, self.collisionBody.center.y);//center at bottom of player sprite
        }
        currentAnimation = animations.pogoFalling;
        currentAnimation.reset();
    }

    function updateFallPogo(deltaTime) {
        heldJumpTime += deltaTime;
        if (checkForPressedKeys([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2])) {
			velocity.x = WALK_SPEED;
            flipped = false;
		} else if (checkForPressedKeys([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2])) {
			velocity.x = -WALK_SPEED;
            flipped = true;
        }
    }

    function exitFallPogo(deltaTime) {
        handlebar.deactivate();
    }

    function finishedAttackingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.attacking;
    }
    
    function finishedCrouchAttackAnimation(deltaTime) {
        return currentAnimation.getIsFinished() || currentAnimation != animations.attackcrouch;
    }

    function finishedJumpAttackingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.attackjump;
    }

    function finishedThrowingAnimation(deltaTime) {
        return currentAnimation.getIsFinished() || currentAnimation != animations.throwing;
    }

	function collidedWithWalkable(deltaTime) {
		return isOnGround;
	}

	function finishedLandingAnimation(deltaTime) {
		return currentAnimation.getIsFinished() || currentAnimation != animations.landing;
	}

    let crouchY = 0
	function enterCrouching(deltaTime) {
        velocity.x = 0;
        position.y += 6;

        currentAnimation = animations.crouching;
        if(flipped) {
            colliderManager.setPointsForState(PlayerState.CrouchLeft, position);
        } else {
            colliderManager.setPointsForState(PlayerState.CrouchRight, position);
        }
        colliderManager.updateCollider(position.x, position.y);
        crouchY = drawPosition.y;
	}

	function enterCrouchingLeft(deltaTime) {
		enterCrouching(deltaTime);
        flipped = true;
    }
    
	function enterCrouchingRight(deltaTime) {
		enterCrouching(deltaTime);
		flipped = false;
    }

    function updateCrouching(deltaTime) {
        drawPosition.y = crouchY;
    }
    
    function exitCrouch(deltaTime) {
        position.y -= 9;
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
        return true;
	}

	function enterGettingHurt(deltaTime) {
		self.health--;
		hurt1.play();
    }
    
    function finishedDeathAnimation(deltaTime) {
        return currentAnimation.getIsFinished() || currentAnimation != animations.dieing;
    }

	function enterDead(deltaTime) {
        currentAnimation = animations.dieing;
        currentAnimation.reset();
        playerDeath.play();
    }
    
    function updateDead(deltaTime) {

    }

    function exitDead(deltaTime) {
        SceneState.scenes[SCENE.GAME].removeMe(self);
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

        flashTimer = 0;
	}

	function updateKnockBack(deltaTime) {
        flashTimer += deltaTime;

        if (velocity.x > 0) {
            velocity.x -= 2;
        } else if (velocity.x < 0) {
            velocity.x += 2;
        }
	}

	function exitKnockBack(deltaTime) {
		velocity.x = 0;
        lastCollidedEnemy = null;
        flashTimer = FLASH_TIME;
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
        { x: startX + 23, y: startY + FRAME_HEIGHT  - 1}, //bottom right +23/+32 makes collision box smaller than sprite
        { x: startX + 10, y: startY + FRAME_HEIGHT - 1} //bottom left +10/+32 makes collision box smaller than sprite
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
        const drawOffset = colliderManager.updateCollider(position.x, position.y);
        drawPosition.x = position.x - spawn.x - 26;
        drawPosition.y = position.y - spawn.y + 2;
        this.collisionBody.calcOnscreen(canvas);
    };

    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        const drawOffset = colliderManager.updateCollider(position.x, position.y);
        drawPosition.x = position.x - spawn.x - 26 - canvas.offsetX + drawOffset.x;
        drawPosition.y = position.y - spawn.y + 2 - canvas.offsetY + drawOffset.y;
        this.collisionBody.calcOnscreen(canvas);
    };

    this.setToolSpawnPoint = function(deltaX, deltaY) {
        chain.setSpawnPoint(drawPosition.x, drawPosition.y);
    };

    this.reset = function () {
        velocity.x = 0;
        velocity.y = 0;

        isOnGround = true;
        heldJumpTime = 0;
        flipped = false;
        didHitRoad = false;
    };

    this.getSize = function () {
        return SIZE;
    };

    this.getDrawPosition = function() {
        return drawPosition;
    };

    this.didPogoEnemy = function() {
        heldJumpTime = 0;
        this.pogoedAnEnemy = true;
    }

    this.update = function (deltaTime) {
        if (colliderManager.state === null) {
            colliderManager.setPointsForState(PlayerState.IdleRight, position);
        }

        if((hasWheel) && wheel.isActive) {
            wheel.update(deltaTime, this.collisionBody.center);
        }

        if((hasHandleBar) && handlebar.isActive) {
            handlebar.update(deltaTime, this.collisionBody.center);
        }

        if(flashTimer < FLASH_TIME) {
            flashTimer += deltaTime;
            if(Math.floor(flashTimer / 100) % 2 === 0) {
                currentAnimation.useBrightImage = !currentAnimation.useBrightImage;
            }
        } else {
            flashTimer = FLASH_TIME;
            currentAnimation.useBrightImage = false;
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
        if(healthDepleted()) heldButtons.length = 0;
    };

    this.draw = function (deltaTime) {
        currentAnimation.drawAt(drawPosition.x, drawPosition.y - canvas.deltaY, flipped, 0);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
        chain.draw();
        wheel.draw();
        handlebar.draw();
    };

    this.didCollideWith = function (otherEntity, collisionData) {
		if(((isEnemy(otherEntity) && (!otherEntity.dead))) || (isEnemyWeapon(otherEntity))) {
            if(otherEntity.type !== EntityType.FlyingFist || !otherEntity.dead) {
                lastCollidedEnemy = otherEntity;
            }
        } else if(otherEntity.type === EntityType.LevelExit) {
            SceneState.scenes[SCENE.GAME].playerAtExit();
        } else if (isEnvironment(otherEntity)) {
            if(otherEntity.type === EntityType.BossRoomEntrance) {
                currentBackgroundMusic.loopSong(BOSS_MUSIC_FILENAME);
            } else if(otherEntity.type === EntityType.Deadzone) {
                SceneState.scenes[SCENE.GAME].removeMe(self);
            } else {
                if(otherEntity.type === EntityType.Roadzone) {
                    lastCollidedEnemy = otherEntity;
                    didHitRoad = true;
                }

                if(otherEntity.type === EntityType.WallBarrier) {
                    if(currentLevelName === MAP_NAME.Area51 && SceneState.scenes[SCENE.GAME].mechsDefeated() >= 2) {
                        return;
                    }
                }

                if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                    if(!didHitRoad) {
                        this.setPosition(position.x + collisionData.deltaX, position.y);
                    }
                } else {
                    this.setPosition(position.x, position.y + collisionData.deltaY);
                    if(collisionData.deltaY < 0) {
                        isOnGround = true;
                    }
                }
    
                justCollidedWithEnvironment = true;
            }
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
                case EntityType.WheelPickup:
                    playerPickup2.play();
                    hasWheel = true;
                    SceneState.scenes[SCENE.GAME].gotWheel();
                    break;
                case EntityType.HandlebarPickup:
                    playerPickup2.play();
                    hasHandleBar = true;
                    SceneState.scenes[SCENE.GAME].gotHandlebar();
                    break;
                case EntityType.EnginePickup:
                    playerPickup2.play();
                    hasEngine = true;
                    SceneState.scenes[SCENE.GAME].gotEngine();
                    break;
            }
        }
    };

    const initializeAnimations = function () {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true, [8, 8, 8, 8], playerBrightSheet);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [4, 5, 6, 7], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true, [0], playerBrightSheet);
        anims.walking.scale = SCALE;
        anims.climbing = new SpriteAnimation('climb', playerSpriteSheet, [29, 30], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [9], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false, [0], playerBrightSheet);
        anims.landing = new SpriteAnimation('land', playerSpriteSheet, [11, 12, 13], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 60], false, false, [0], playerBrightSheet);
        anims.attacking = new SpriteAnimation('attack', playerSpriteSheet, [20, 21, 22], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false, [0], playerBrightSheet);
        anims.attackcrouch = new SpriteAnimation('attackcrouch', playerSpriteSheet, [23, 24, 25], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false, [0], playerBrightSheet);
        anims.attackjump = new SpriteAnimation('attackjump', playerSpriteSheet, [26, 27, 28], FRAME_WIDTH, FRAME_HEIGHT, [80, 60, 100], false, false, [0], playerBrightSheet);
        anims.throwing = new SpriteAnimation('throw', playerSpriteSheet, [9, 10, 11, 12], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.pogoJumping = new SpriteAnimation('pogoJump', playerSpriteSheet, [9], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.pogoFalling = new SpriteAnimation('pogoFall', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.crouching = new SpriteAnimation('crouch', playerSpriteSheet, [14], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false, [0], playerBrightSheet);
        anims.thumbup = new SpriteAnimation('thumbup', playerSpriteSheet, [15, 16, 17, 18, 19], FRAME_WIDTH, FRAME_HEIGHT, [100, 100, 100, 100, 400], false, false, [0], playerBrightSheet);
        anims.knockback = new SpriteAnimation('knockedback', playerSpriteSheet, [12], FRAME_WIDTH, FRAME_HEIGHT, [125], false, false, [0], playerBrightSheet);
        anims.dieing = new SpriteAnimation('death', playerSpriteSheet, [31, 32, 33], FRAME_WIDTH, FRAME_HEIGHT, [125, 125, 400], false, false, [0], playerBrightSheet);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}
