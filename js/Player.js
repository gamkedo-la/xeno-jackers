//Player
function Player(startX, startY, hasChain, hasWheel, hasHandleBar, hasEngine) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const MAX_Y_SPEED = 130;
    const MAX_JUMP_TIME = 170;
    const FRAME_WIDTH = 23;
    const FRAME_HEIGHT = 33;
    const SIZE = {width:FRAME_WIDTH, height:FRAME_HEIGHT};

    let currentAnimation;
    let position = {x:startX, y:startY};
    let velocity = {x:0, y:0};
    
    let isBlocking = false;
    let isCrouching = false;

    let wasKnockedBack = false;
    let isOnGround = true;
    let isFalling = false;
    let isLanding = false;
    let heldJumpTime = 0;
    let flipped = false;

    let levelWidth = 0;
    let levelHeight = 0;

    this.health = 10;
    this.type = EntityType.Player;

    this.collisionBody = new Collider(ColliderType.Polygon, [
        {x:startX + 2, y:startY + 3}, //top left +2/+3 to make collision box smaller than sprite
        {x:startX + 21, y:startY + 3}, //top right +21/+3 makes collision box smaller than sprite
        {x:startX + 21, y:startY + 32}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:startX + 2, y:startY + 32} //bottom left +2/+32 makes collision box smaller than sprite
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

    this.gotNewTool = function(newTool) {
        switch(newTool) {
            case PICKUP.Chain:
                hasChainWeapon = true;
            case PICKUP.Wheel:
                hasWheelWeapon = treu;
            case PICKUP.Handlebar:
                hasHandlebar = true;
            case PICKUP.Engine:
                hasEngine = true;
        }
    }

    this.reset = function() {
        velocity.x = 0;
        velocity.y = 0;
        
        isBlocking = false;
        isCrouching = false;

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

        processInput(deltaTime);

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

    this.setLevelWidth = function(newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function(newHeight) {
        levelHeight = newHeight;
    };

    const processInput = function(deltaTime) {
        if(heldButtons.length === 0) {
            if(!isLanding) {
                idle();
            }

            if((!wasKnockedBack) && (isOnGround)) {
                velocity.x = 0;
            }
        }

        for(let i = 0; i < heldButtons.length; i++) {
            switch(heldButtons[i]) {
                case ALIAS.WALK_LEFT:
                    moveLeft();
                    break;
                case ALIAS.WALK_RIGHT:
                    moveRight();
                    break;
                case ALIAS.JUMP:
                    if(heldJumpTime < MAX_JUMP_TIME) jump(deltaTime);
                    break;
                case ALIAS.BLOCK:
                    stillBlocking = true;
                    block();
                    break;
                case ALIAS.CROUCH:
                    crouch();
                    break;
            }
        }
    }

    const idle = function() {
        currentAnimation = animations.idle;
    };

    const moveLeft = function() {
        if(wasKnockedBack) return;

        flipped = true;
        velocity.x = -WALK_SPEED;
        currentAnimation = animations.walking;
        if(position.x < 0) {
            position.x = 0;
        }
    };

    const moveRight = function() {
        if(wasKnockedBack) return;

        flipped = false;
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
        if((currentAnimation === animations.attacking) && (!currentAnimation.getIsFinished())) {
            return;
        } else {
            console.log("Trying to attack");
//            currentAnimation = animations.attacking;
        }
    };

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("I'm crouching now");
            isCrouching = true;
//            currentAnimation = animations.crouching;
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
                return;
            } 

            wasKnockedBack = true;

            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                velocity.x = -KNOCKBACK_SPEED;
            } else {
                velocity.x = KNOCKBACK_SPEED;
            }

            velocity.y = -85;

        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move player the full amount of the overlap
            if(velocity.y > 0) {
                wasKnockedBack = false;
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
                    this.health++;
                    break;
                case EntityType.Chain:
                    hasChain = true;
                    SceneState.scenes[SCENE.GAME].gotChain();
                    break;
                case EntityType.Handlebar:
                    hasHandleBar = true;
                    SceneState.scenes[SCENE.GAME].gotHandlebar();
                    break;
                case EntityType.Wheel:
                    hasWheel = true;
                    SceneState.scenes[SCENE.GAME].gotWheel();
                    break;
                case EntityType.Engine:
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

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0], FRAME_WIDTH, FRAME_HEIGHT, [256], false, true);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [1, 2, 3, 4], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true);
        anims.walking.scale = SCALE;
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [6], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [7], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
        anims.landing = new SpriteAnimation('land', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false);
//        anims.attacking = ...
//        anims.blocking = ...
//        anims.crouching = ...

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