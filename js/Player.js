//Player
function Player() {
    const scale = 4;//TODO: Make player sprite larger so this can be a 1
    let currentAnimation;
    let position = {x:canvas.width / 2, y:canvas.height / 2}
    
    let isOnGround = true;
    let isCrouching = false;
    let isBlocking = false;

    let hasBlock = false;
    let hasSweep = false;
    let hasJumpKick = false;
    let hasHelicopterKick = false;

    this.update = function(deltaTime) {
        currentAnimation.update(deltaTime);

        processInput();
    }

    const processInput = function() {
        let stillCrouching = false;
        let stillBlocking = false;
        for(let i = 0; i < heldButtons.length; i++) {
            switch(heldButtons[i]) {
                case ALIAS.LEFT:
                    moveLeft();
                    break;
                case ALIAS.RIGHT:
                    moveRight();
                    break;
                case ALIAS.JUMP:
                    jump();
                    break;
                case ALIAS.CROUCH:
                    stillCrouching = true;
                    crouch();
                    break;
                case ALIAS.BLOCK:
                    stillBlocking = true;
                    block();
                    break;
                case ALIAS.PUNCH:
                    punch();
                    break;
                case ALIAS.KICK:
                    kick();
                    break;
            }
        }

        if(!stillCrouching) {isCrouching = false;}
        if(!stillBlocking) {isBlocking = false;}
    }

    const moveLeft = function() {
        position.x -= 10;
    }

    const moveRight = function() {
        position.x += 10;
    }

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
//            currentAnimation = animations.jumping;
            console.log("Need to jump now, also need some gravity to make you land");
        }
    }

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("I'm crouching now");
            isCrouching = true;
//            currentAnimation = animations.crouching;
        }
    }

    const block = function() {
        if(isOnGround && hasBlock && !isBlocking) {
            console.log("I'm blocking now");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    }

    const punch = function() {
        if((currentAnimation === animations.punching) && (!currentAnimation.isFinished)) {
            return;
        } else {
            console.log("Trying to punch");
//            currentAnimation = animations.punching;
        }
    }

    const kick = function() {
        if(isStillKicking()) {return;}

        console.log("Trying to kick");
        if(isOnGround) {
//            currentAnimation = animations.kicking;
        } else {
            if(hasHelicopterKick && isHoldingLeftorRight()) {
                console.log("Helicopter Kick!!!!");
//                currentAnimation = animations.helicopterKicking;
            } else if(hasJumpKick) {
                console.log("Jump Kick");
//                currentAnimation = animations.jumpKicking;
            } else if(hasSweep) {
                console.log("Sweep");
//                currentAnimation = animations.sweeping;
            }
        }
    }

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x, position.y);
    }

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', tempPlayer, [0], 11, 58, [64], false, true);
        anims.idle.scale = scale;
//        animations.jumping = ...
//        animations.crouching = ...
//        animations.punching = ...
//        animations.kicking = ...
//        animations.blocking = ...
//        animations.sweeping = ...
//        animations.jumpKicking = ...
//        animations.helicopterKicking = ...

        return anims;
    }
    const animations = initializeAnimations();
    currentAnimation = animations.idle;

    const isHoldingLeftorRight = function() {
        for(let i = 0; i < heldButtons.length; i++) {
            if(heldButtons[i] === ALIAS.LEFT) {
                return true;
            } else if(heldButtons[i] === ALIAS.RIGHT) {
                return true;
            }
        }

        return false;
    }

    const isStillKicking = function() {
        if(((currentAnimation === animations.kicking) ||
        (currentAnimation === animations.sweeping) ||
        (currentAnimation === animations.jumpKicking) ||
        (currentAnimation === animations.helicopterKicking)) &&
        (!currentAnimation.isFinished)) {
            return true;
        } else {
            return false;
        }
    }
}