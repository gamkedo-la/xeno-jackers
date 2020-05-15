//Player
function Player(startX, startY) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 65;
    const KNOCKBACK_SPEED = 100;
    const JUMP_SPEED = 130;
    const FRAME_WIDTH = 23;
    let currentAnimation;
    let position = {x:startX, y:startY};
    let velocity = {x:0, y:0};
    
    let isBlocking = false;
    let isCrouching = false;

    let wasKnockedBack = false;
    let isOnGround = true;
    let isFalling = false;
    let isLanding = false;
    let hasChainWeapon = false;
    let hasWheelWeapon = false;
    let hasHandleBarWeapon = false;
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
        position.y += Math.round(velocity.y * deltaTime / 1000); 

        processInput();

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
            console.log(`isFinished Landing: ${currentAnimation.getIsFinished()}`);
            if(currentAnimation.getIsFinished()) {
                isLanding = false;
                currentAnimation = animations.idle;
            }
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

    const processInput = function() {
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
                    jump();
                    break;
                case ALIAS.BLOCK:
                    stillBlocking = true;
                    block();
                    break;
                case ALIAS.ATTACK:
                    attack();
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

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
            velocity.y = -JUMP_SPEED;
        }
    };

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
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
                    currentAnimation = animations.landing;
                    currentAnimation.reset();
                }
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

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0], FRAME_WIDTH, 33, [256], false, true);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [1, 2, 3, 4], FRAME_WIDTH, 33, [164], false, true);
        anims.walking.scale = SCALE;
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [6], FRAME_WIDTH, 33, [164], false, false);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [7], FRAME_WIDTH, 33, [164], false, false);
        anims.landing = new SpriteAnimation('land', playerSpriteSheet, [8], FRAME_WIDTH, 33, [164], false, false);
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