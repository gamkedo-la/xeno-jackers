//BikerEnemy.js
function BikerEnemy(posX, posY) {
    const SCALE = GAME_SCALE;
    let currentAnimation;
    let position = {x:posX, y:posY};
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
    let hasChainWeapon = false;
    let hasWheelWeapon = false;
    let hasHandleBarWeapon = false;
    let flipped = false;

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);

        if(player.getPosition().x < position.x) {
            flipped = true;
        } else {
            flipped = false;
        }
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
            console.log("Biker Enemy is trying to jump.");
        }
    }

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
            console.log("Biker Enemy is trying to block.");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    }

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.isFinished)) {
            return;
        } else {
            console.log("Biker Enemy is trying to attack.");
//            currentAnimation = animations.attacking;
        }
    }

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("Biker Enemy is crouching now.");
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
}