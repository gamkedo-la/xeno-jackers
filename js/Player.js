//Player
function Player() {
    const SCALE = GAME_SCALE;
    let currentAnimation;
    let position = {x:canvas.width / 2, y:canvas.height / 2}
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
    let hasChainWeapon = false;
    let hasWheelWeapon = false;
    let hasHandleBarWeapon = false;
    let flipped = false;

    this.getPosition = function() {
        return {x:position.x, y:position.y};
    };

    this.update = function(deltaTime) {
        currentAnimation.update(deltaTime);

        processInput();
    }

    const processInput = function() {
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

    const moveLeft = function() {
        flipped = true;
        position.x -= 10;
    }

    const moveRight = function() {
        flipped = false;
        position.x += 10;
    }

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
//            currentAnimation = animations.jumping;
            console.log("Need to jump now, also need some gravity to make you land");
        }
    }

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
            console.log("I'm blocking now");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    }

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.isFinished)) {
            return;
        } else {
            console.log("Trying to attack");
//            currentAnimation = animations.attacking;
        }
    }

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("I'm crouching now");
            isCrouching = true;
//            currentAnimation = animations.crouching;
        }
    }

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x, position.y, flipped);
    }

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0, 1], 23, 33, [256], false, true);
        anims.idle.scale = SCALE;
//        animations.jumping = ...
//        animations.attacking = ...
//        animations.blocking = ...
//        animations.crouching = ...

        return anims;
    }
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
    }
}