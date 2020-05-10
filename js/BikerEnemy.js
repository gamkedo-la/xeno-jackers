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

/*    this.collisionBody = new Collider(ColliderType.Polygon, [
        {x:posX + 1, y:posY + 1}, //top left +1/+1 to make collision box smaller than sprite
        {x:posX + 21, y:posY + 1}, //top right +21/+1 makes collision box smaller than sprite
        {x:posX + 21, y:posY + 30}, //bottom right +21/+30 makes collision box smaller than sprite
        {x:posX + 1, y:posY + 30} //bottom left +1/+30 makes collision box smaller than sprite
    ]);*/

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;

        if(player.getPosition().x < position.x) {
            flipped = true;
        } else {
            flipped = false;
        }

        //keep collisionBody in synch with sprite
//        this.collisionBody.setPosition(position.x, position.y);
    };

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

        //colliders only draw when DRAW_COLLIDERS is set to true
//        this.collisionBody.draw();
    }

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', bikerEnemySheet, [0, 1], 23, 33, [256], false, true);
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