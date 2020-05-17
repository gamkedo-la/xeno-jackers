//EnemyAlienGuard.js
function EnemyAlienGuard(posX, posY) {
    const SCALE = GAME_SCALE;
    const WIDTH = 23;
    const HEIGHT = 33;
    const SIZE = {width:WIDTH, height:HEIGHT};

    let currentAnimation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};
    
    let isBlocking = false;
    let isCrouching = false;

    let isOnGround = true;
    let flipped = false;

    this.type = EntityType.EnemyAlienGuard;
    this.health = 2;

    this.collisionBody = new Collider(ColliderType.Polygon, [
        {x:posX + 2, y:posY + 3}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 21, y:posY + 3}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 21, y:posY + 32}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 2, y:posY + 32} //bottom left +2/+32 makes collision box smaller than sprite
    ], {x:posX, y:posY});

    this.getSize = function() {
        return SIZE;
    };

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;

        if(this.collisionBody.isOnScreen) {
            position.x += Math.round(velocity.x * deltaTime / 1000);
            velocity.y += Math.round(GRAVITY * deltaTime / 1000);
            position.y += Math.round(velocity.y * deltaTime / 1000); 

            if(player.getPosition().x < position.x) {
                flipped = true;
            } else {
                flipped = false;
            }
        }

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const moveLeft = function() {
        position.x -= 10;
    };

    const moveRight = function() {
        position.x += 10;
    };

    const jump = function() {
        if(isOnGround) {
            isOnGround = false;
//            currentAnimation = animations.jumping;
            console.log("Enemy Alien Guard is trying to jump.");
        }
    };

    const block = function() {
        if(isOnGround && hasWheelWeapon && !isBlocking) {
            console.log("Enemy Alien Guard is trying to block.");
            isBlocking = true;
//            currentAnimation = animations.blocking;
        }
    };

    const attack = function() {
        if((currentAnimation === animations.attacking) && (!currentAnimation.getIsFinished())) {
            return;
        } else {
            console.log("Enemy Alien Guard is trying to attack.");
//            currentAnimation = animations.attacking;
        }
    };

    const crouch = function() {
        if(isOnGround && !isCrouching) {
            console.log("Enemy Alien Guard is crouching now.");
            isCrouching = true;
//            currentAnimation = animations.crouching;
        }
    };

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(position.x, position.y, flipped);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            this.health--;

            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                position.x -= 5;
            } else {
                position.x += 5;
            }

            if(this.health <= 0) SceneState.scenes[SCENE.GAME].removeMe(this);
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move player the full amount of the overlap
            position.x += Math.ceil(collisionData.magnitude * collisionData.x);
            if(Math.abs(collisionData.x) > 0.01) velocity.x = 0;
            position.y += Math.ceil(collisionData.magnitude * collisionData.y);
            if(Math.abs(collisionData.y) > 0.01) velocity.y = 0;
            this.collisionBody.setPosition(position.x, position.y);
        }
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', enemyAlienGuardSheet, [0, 1], 23, 34, [256], false, true);
        anims.idle.scale = SCALE;
//        animations.jumping = ...
//        animations.attacking = ...
//        animations.blocking = ...
//        animations.crouching = ...

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.idle;
}