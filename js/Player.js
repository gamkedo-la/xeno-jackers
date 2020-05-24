//Player
function Player(startX, startY, hasChain, hasWheel, hasHandleBar, hasEngine) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const KNOCKBACK_YSPEED = -85;
    const MAX_JUMP_TIME = 170;
    const FRAME_WIDTH = 24; //old tile sheet = 24, new tile sheet = 64
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
    let isFalling = false;
    let isLanding = false;
    let heldJumpTime = 0;
    let flipped = false;

    let levelWidth = 0;
    let levelHeight = 0;

    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.type = EntityType.Player;

    this.collisionBody = new Collider(ColliderType.Polygon,
        [   {x:startX + 4, y:startY + 6}, //top left +2/+3 to make collision box smaller than sprite
            {x:startX + 17, y:startY + 6}, //top right +21/+3 makes collision box smaller than sprite
            {x:startX + 17, y:startY + FRAME_HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
            {x:startX + 4, y:startY + FRAME_HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
        ], {x:startX, y:startY});

    this.getPosition = function() {
        return {x:position.x, y:position.y};
    };

    this.setPosition = function(x, y) {
        position.x = x;
        position.y = y;
        //keep collisionBody in synch with sprite
        updateCollisionBody(this.collisionBody);
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
        isFalling = false;
        isLanding = false;
        heldJumpTime = 0;
        flipped = false;
    };

    this.getSize = function() {
        return SIZE;
    };

    this.update = function(deltaTime) {
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

        if(!isOnGround) {
            if(velocity.y < 0) {
                currentAnimation = animations.jumping;
                currentAnimation.reset();
            } else {
                isFalling = true;
                currentAnimation = animations.falling;
                currentAnimation.reset();
            }
        } else if(isLanding) {
            if((currentAnimation.getIsFinished()) || (currentAnimation != animations.landing)) {
                isLanding = false;
                currentAnimation = animations.idle;
            }
        }

        if(position.y > levelHeight) {
            this.health = 0;
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }
        
        //keep collisionBody in synch with sprite
        updateCollisionBody(this.collisionBody);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.newKeyPressed = function(newKey) {
        if(newKey === ALIAS.JUMP || newKey === ALIAS.JUMP2) {
            if(isOnGround && !isLanding) {
                if(heldJumpTime < MAX_JUMP_TIME) jump(0);
            }
        }
    };

    this.setLevelWidth = function(newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function(newHeight) {
        levelHeight = newHeight;
    };

    const processInput = function(deltaTime, body) {
        let didRespond = false;
        isWalking = false;
        const wasCrouching = isCrouching;
        isCrouching = false;

        for(let i = 0; i < heldButtons.length; i++) {
            switch(heldButtons[i]) {
                case ALIAS.WALK_LEFT:
                case ALIAS.WALK_LEFT2:
                    moveLeft();
                    didRespond = true;
                    break;
                case ALIAS.WALK_RIGHT:
                case ALIAS.WALK_RIGHT2:
                    moveRight();
                    didRespond = true;
                    break;
                case ALIAS.JUMP:
                case ALIAS.JUMP2:
                    if(isOnGround) break;
                    if(heldJumpTime < MAX_JUMP_TIME) jump(deltaTime);
                    didRespond = true;
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

        if(isOnGround !== wasOnGround) {
            switchToJumpingPoints(body);
            wasOnGround = isOnGround;
        }

        if(wasCrouching !== isCrouching) {
            switchToCrouchedPoints(body);
        }

        if(!didRespond) {
            if(!isLanding) {
                idle();
            }

            if((!wasKnockedBack) && (isOnGround)) {
                velocity.x = 0;
            }
        }
    }

    const idle = function() {
        currentAnimation = animations.idle;
        velocity.x = 0;
        isBlocking = false;
        isCrouching = false;
        isThumbUp = false;
        isFalling = false;
        isLanding = false;
        if(!isOnGround) {
            heldJumpTime = MAX_JUMP_TIME;
        }
    };

    const moveLeft = function() {
        if(wasKnockedBack) return;
        if(isLanding) return;
        flipped = true;
        if(isCrouching) return;

        if(isThumbUp) {
            isThumbUp = false;
        };
        
        isWalking = true;
        
        velocity.x = -WALK_SPEED;
        currentAnimation = animations.walking;
        if(position.x < 0) {
            position.x = 0;
        }
    };

    const moveRight = function() {
        if(wasKnockedBack) return;
        if(isLanding) return;
        flipped = false;
        if(isCrouching) return;

        if(isThumbUp) {
            isThumbUp = false;
        };
        
        isWalking = true;
        
        velocity.x = WALK_SPEED;
        currentAnimation = animations.walking;
        if(position.x + FRAME_WIDTH > levelWidth) {
            position.x = levelWidth;
        }
    };

    const jump = function(deltaTime) {
        if(isOnGround) {
            isOnGround = false;
            velocity.y = -MAX_Y_SPEED / 10;
        } else {
            velocity.y -= MAX_Y_SPEED / 10;
            heldJumpTime += deltaTime;
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
            currentAnimation = animations.attacking;
            currentAnimation.reset();
        }
    };

    const crouch = function() {
        

        if(isOnGround && !isCrouching) {
            isCrouching = true;
            velocity.x = 0;
            currentAnimation = animations.crouching;
        }
    };

    const thumbup = function() {
        if (isWalking) return;

        if(isOnGround && currentAnimation != animations.thumbup) {
            isThumbUp = true;
            velocity.x = 0;
            currentAnimation = animations.thumbup;
            currentAnimation.reset();
        }
    };

    const switchToCrouchedPoints = function(body) {
        if(!isCrouching) {
            body.setPoints([
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + 6}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + 6}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}, 
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}
            ]);
        } else {
            body.setPoints([
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + 12}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + 12}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}, 
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}
            ]);
        }
    };

    const switchToJumpingPoints = function(body) {
        if(isOnGround) {
            body.setPoints([
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + 6}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + 6}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}, 
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT}
            ]);
        } else {
            body.setPoints([
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + 4}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + 4}, 
                {x:position.x + (startX - canvas.center.x) + 17, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT - 6}, 
                {x:position.x + (startX - canvas.center.x) + 4, y:position.y + (startY - canvas.center.y) + FRAME_HEIGHT - 6}
            ]);
        }
    };

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x + (startX - canvas.center.x), position.y + (startY - canvas.center.y), flipped);

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
            updateCollisionBody(this.collisionBody);
            
            if(collisionData.y < -0.1) {
                isOnGround = true;

                if(isFalling) {
                    isFalling = false;
                    isLanding = true;
                    heldJumpTime = 0;
                    currentAnimation = animations.landing;
                    currentAnimation.reset();
                }
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

    const updateCollisionBody = function(body) {
        body.setPosition(//this is complicated because the player moves the camera/canvas
            position.x + (startX - canvas.center.x), 
            position.y + (startY - canvas.center.y)
        );
    };

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