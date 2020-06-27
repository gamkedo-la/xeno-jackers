//Wheel.js
function Wheel() {
    const FRAME_WIDTH = 16;
    const FRAME_HEIGHT = 16;
    this.type = EntityType.Wheel;
    this.points = [
        {x: 1, y: 1},// 0,0
        {x: 14, y: 1},// 53,0
        {x: 14, y: 14},// 53,7
        {x: 1, y: 14},// 0,7
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    let velocity = {x: 0, y: 0};
    let spawnPoint = {x:0, y:0};
    this.isActive = false;
    let currentAnimation = new SpriteAnimation('idle', wheelPickup, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true);
    this.collisionBody = new AABBCollider(this.points);

    this.setSpawnPoint = function(x, y) {
        /*this.position.x = x;
        this.position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);*/

    };

    this.collisionBody = new AABBCollider(this.points);

    this.activate = function(x, y, speed) {
        this.isActive = true;
        velocity.x = speed;

        /*const deltaX = x - this.position.x;
        const deltaY = y - this.position.y;

        this.position.x = x;
        this.position.y = y;
        

        for (let point of this.points) {
            point.x += deltaX;
            point.y += deltaY;
        }*/

        this.position.x = x;
        this.position.y = y;

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
        SceneState.scenes[SCENE.GAME].addCollisionEntity(this);
    };

    this.deactivate = function() {
        this.isActive = false;
        SceneState.scenes[SCENE.GAME].removeCollisionEntity(this);
    };

    this.update = function(deltaTime, playerPos) {
        currentAnimation.update(deltaTime);

        this.position.x += Math.round(velocity.x * deltaTime / 1000);
        const diff = (this.collisionBody.center.x - playerPos.x) / 4;
        if(this.collisionBody.center.x > playerPos.x) {
            velocity.x -= clamp((400 / (diff * diff)), 5, 20);
            if(velocity.x < -100) velocity.x = -275;
        } else if(this.collisionBody.center.x < playerPos.x) {
            velocity.x += clamp((400 / (diff * diff)), 5, 20);
            if(velocity.x > 100) velocity.x = 275;
        }

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function() {
        if(this.isActive) {
            //currentAnimation.drawAt(this.position.x, this.position.y);
            currentAnimation.drawAt(Math.round(this.collisionBody.center.x - 8), Math.round(this.collisionBody.center.y - 8));
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            this.deactivate();
        }
    };

    function clamp(value, low, high) {
        result = value;
        if(result < low) {
            result = low;
        } else if(result > high) {
            result = high;
        }
    
        return result;
    };
}