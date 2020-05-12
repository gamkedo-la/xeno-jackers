//Player
function Player(startX, startY) {
    const SCALE = GAME_SCALE;
    const WALK_SPEED = 1;
    const FRAME_WIDTH = 23;
    let currentAnimation;
    let position = {x:startX, y:startY};
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
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

        processInput();

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(//this is complicated because the player moves the camera/canvas
            position.x + (startX - canvas.center.x), 
            position.y + (startY - canvas.center.y)
        );
    };

    this.setLevelWidth = function(newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function(newHeight) {
        levelHeight = newHeight;
    };

    const processInput = function() {
        if(heldButtons.length === 0) idle();

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
        flipped = true;
        position.x -= WALK_SPEED;
        currentAnimation = animations.walking;
        if(position.x < 0) {
            position.x = 0;
        }
    };

    const moveRight = function() {
        flipped = false;
        position.x += WALK_SPEED;
        currentAnimation = animations.walking;
        if(position.x + FRAME_WIDTH > levelWidth) {
            position.x = levelWidth;
        }
    };

    const fall = function() {
        
    };

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
//            currentAnimation = animations.jumping;
            console.log("Need to jump now, also need some gravity to make you land");
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
        if((currentAnimation === animations.attacking) && (!currentAnimation.isFinished)) {
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

    this.didCollideWith = function(otherEntity) {
        if(isEnemy(otherEntity)) {
            this.health--;

            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                position.x -= 15;
            } else {
                position.x += 15;
            }
        }
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0], FRAME_WIDTH, 33, [256], false, true);
        anims.idle.scale = SCALE;
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [1, 2, 3, 4], FRAME_WIDTH, 33, [164], false, true);
        anims.walking.scale = SCALE;
//        animations.jumping = ...
//        animations.attacking = ...
//        animations.blocking = ...
//        animations.crouching = ...

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