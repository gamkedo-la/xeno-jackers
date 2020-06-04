//Player
function Player(startX, startY, hasChain, hasWheel, hasHandleBar, hasEngine) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const KNOCKBACK_YSPEED = -85;
    const MAX_JUMP_TIME = 170;
    const FRAME_WIDTH = 64; //old tile sheet = 24, new tile sheet = 64
    const FRAME_HEIGHT = 36;
    const SIZE = { width: FRAME_WIDTH, height: FRAME_HEIGHT };

    let currentAnimation;
    let position = { x: startX, y: startY };
    let velocity = { x: 0, y: 0 };

    let isWalking = false;
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
	let lastCollidedEntity;
	let lastCollidedEnemy;
	let getThisPlayer = () => { return this };

    let levelWidth = 0;
    let levelHeight = 0;

    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.type = EntityType.Player;

	const pressedJumpKey = getKeyChecker([ALIAS.JUMP, ALIAS.JUMP2]);
	function releasedJumpKeyOrMaxedTimer(deltaTime) {
		return !pressedJumpKey() || heldJumpTime >= MAX_JUMP_TIME;
	}
	const pressedCrouchKey = getKeyChecker([ALIAS.CROUCH, ALIAS.CROUCH2]);
	function releasedCrouchKey() {
		return !pressedCrouchKey();
	}
	const fsm = new FSM(initial='idle');
	fsm.addState('idle', enterIdle, fsm.noop, fsm.noop);
	fsm.addState('walkingLeft', enterWalkingLeft, updateWalking, exitWalking);
	fsm.addState('walkingRight', enterWalkingRight, updateWalking, exitWalking);
	fsm.addState('jumping', enterJumping, updateJumping, fsm.noop);
	fsm.addState('falling', enterFalling, fsm.noop, exitFalling);
	fsm.addState('landing', enterLanding, fsm.noop, fsm.noop);
	fsm.addState('crouching', enterCrouching, fsm.noop, fsm.noop);
	fsm.addState('knockback', enterKnockBack, updateKnockBack, exitKnockBack);
	fsm.addState('gettingHurt', enterGettingHurt, fsm.noop, fsm.noop);
	fsm.addState('dying', enterDying, fsm.noop, fsm.noop);
	fsm.addState('thumbup', enterThumbUp, fsm.noop, fsm.noop);

	fsm.addTransition(['idle'], 'walkingLeft', getExclusiveKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]));
	fsm.addTransition(['idle'], 'walkingRight', getExclusiveKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]));
	fsm.addTransition(['walkingLeft', 'walkingRight'], 'idle', releasedWalkKey);
	fsm.addTransition(['walkingLeft'], 'walkingRight', getExclusiveKeyChecker([ALIAS.WALK_RIGHT, ALIAS.WALK_RIGHT2]));
	fsm.addTransition(['walkingRight'], 'walkingLeft', getExclusiveKeyChecker([ALIAS.WALK_LEFT, ALIAS.WALK_LEFT2]));
	fsm.addTransition(['idle', 'walkingLeft', 'walkingRight'], 'jumping', pressedJumpKey);
	fsm.addTransition(['jumping'], 'falling', function() {
		return !pressedJumpKey || heldJumpTime >= MAX_JUMP_TIME;
	});
	fsm.addTransition(['falling'], 'landing', collidedWithWalkable);
	fsm.addTransition(['landing'], 'idle', finishedLandingAnimation);
	fsm.addTransition(['idle'], 'crouching', pressedCrouchKey);
	fsm.addTransition(['crouching'], 'idle', releasedCrouchKey);
	fsm.addTransition([
		'idle',
		'walkingLeft',
		'walkingRight',
		'jumping',
		'falling',
		'landing',
		'crouching',
		'thumbup',
	], 'gettingHurt', collidedWithEnemy);
	fsm.addTransition(['gettingHurt'], 'dying', healthDepleted);
	fsm.addTransition(['gettingHurt'], 'knockback', healthRemaining);
	fsm.addTransition(['knockback'], 'idle', collidedWithEnvironmentWhileFalling);
	fsm.addTransition(['idle'], 'thumbup', getKeyChecker([ALIAS.THUMBUP]));
	fsm.addTransition(['thumbup'], 'idle', finishedThumbUpAnimation);

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
        if(!isOnGround) {
            heldJumpTime = MAX_JUMP_TIME;
        }
	};

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
		playerJump.play();
	}

	function updateJumping(deltaTime) {
		velocity.y -= MAX_Y_SPEED / 10;
		heldJumpTime += deltaTime;
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

	function collidedWithEnemy(deltaTime) {
		return typeof(lastCollidedEntity) != 'undefined' && isEnemy(lastCollidedEntity);
	}

	function collidedWithEnvironmentWhileFalling(deltaTime) {
		return typeof(lastCollidedEntity) != 'undefined' && isEnvironment(lastCollidedEntity) && velocity.y > 0;
	}

	function healthDepleted(deltaTime) {
		return getThisPlayer().health <= 0;
	}

	function healthRemaining(deltaTime) {
		return !healthDepleted(deltaTime);
	}

	function enterGettingHurt(deltaTime) {
		lastCollidedEnemy = lastCollidedEntity;
		getThisPlayer().health--;
		hurt1.play();
	}

	function enterDying(deltaTime) {
		// Play death animation?
		SceneState.scenes[SCENE.GAME].removeMe(this);
		//play death sound here?
	}

	function enterKnockBack(deltaTime) {
		let thisPlayer = getThisPlayer();
		if (lastCollidedEnemy.collisionBody.center.x - canvas.center.x >= thisPlayer.collisionBody.center.x) {			
            velocity.x = -KNOCKBACK_SPEED;
        } else {
            velocity.x = KNOCKBACK_SPEED;
        }
		velocity.y = KNOCKBACK_YSPEED;
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
	}

	function enterThumbUp(deltaTime) {
		velocity.x = 0;
        if (currentAnimation !== animations.thumbup) {
            if (flipped) {
                colliderManager.setPointsForState(PlayerState.Thumb, position);
            } else {
                colliderManager.setPointsForState(PlayerState.Thumb, position);
            }
        }
        currentAnimation = animations.thumbup;
        currentAnimation.reset();
	}

	function finishedThumbUpAnimation() {
		return currentAnimation == animations.thumbup && currentAnimation.getIsFinished();
	}

    const colliderManager = new PlayerColliderManager(startX, startY, SIZE);
    this.collisionBody = new Collider(ColliderType.Polygon,
        [{ x: startX + 10, y: startY + 6 }, //top left +10/+6 to make collision box smaller than sprite
        { x: startX + 23, y: startY + 6 }, //top right +23/+6 makes collision box smaller than sprite
        { x: startX + 23, y: startY + FRAME_HEIGHT }, //bottom right +23/+32 makes collision box smaller than sprite
        { x: startX + 10, y: startY + FRAME_HEIGHT } //bottom left +10/+32 makes collision box smaller than sprite
        ], { x: startX, y: startY });
    colliderManager.setBody(this.collisionBody);

    this.getPosition = function () {
        return { x: position.x, y: position.y };
    };

    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        colliderManager.updateCollider(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.reset = function () {
        velocity.x = 0;
        velocity.y = 0;

        isBlocking = false;
        isWalking = false;

        isOnGround = true;
        heldJumpTime = 0;
        flipped = false;
    };

    this.getSize = function () {
        return SIZE;
    };

    this.update = function (deltaTime) {
        if (colliderManager.state === null) {
            colliderManager.setPointsForState(PlayerState.IdleRight, position);
        }

        currentAnimation.update(deltaTime);

        position.x += Math.round(velocity.x * deltaTime / 1000);
        velocity.y += Math.round(GRAVITY * deltaTime / 1000);
        if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
        position.y += Math.round(velocity.y * deltaTime / 1000);

        //console.log("Position Y", position.y);

        processInput(deltaTime, this.collisionBody);
		fsm.update(deltaTime);
        if (position.y > levelHeight) {
            this.health = 0;
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }

        //keep collisionBody in synch with sprite
        //        updateCollisionBody(this.collisionBody);
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
        let didRespond = false;

        for (let i = 0; i < heldButtons.length; i++) {
            switch (heldButtons[i]) {
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
                    didRespond = true;
                    break;
            }
        }

    };

    const block = function () {
        if (isOnGround && !isBlocking) {
            console.log("I'm blocking now");
            isBlocking = true;
            //            currentAnimation = animations.blocking;
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
            }
            currentAnimation = animations.attacking;
            currentAnimation.reset();
        }
    };

    this.draw = function (deltaTime) {
        currentAnimation.drawAt(position.x + (startX - canvas.center.x), position.y + (startY - canvas.center.y), flipped, -11);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
    };

    this.didCollideWith = function (otherEntity, collisionData) {
		lastCollidedEntity = otherEntity;
		fsm.update(0);
		if (isEnvironment(otherEntity)) {
            if (dotProduct(velocity, { x: collisionData.x, y: collisionData.y }) > 0) {
                return;
            }

            colliderManager.processEnvironmentCollision(position, velocity, otherEntity, collisionData);

            if (collisionData.y < -0.1) {
                isOnGround = true;
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

    /*    const updateCollisionBody = function(body) {
            body.setPosition(//this is complicated because the player moves the camera/canvas
                position.x + (startX - canvas.center.x), 
                position.y + (startY - canvas.center.y)
            );
        };*/

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
        //        anims.blocking = ...
        anims.crouching = new SpriteAnimation('crouch', playerSpriteSheet, [14], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.thumbup = new SpriteAnimation('thumbup', playerSpriteSheet, [15, 16, 17, 18, 19], FRAME_WIDTH, FRAME_HEIGHT, [100, 100, 100, 100, 400], false, false);

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
