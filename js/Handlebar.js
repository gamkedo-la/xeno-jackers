//Handlebar.js
function Handlebar(player) {
    const FRAME_WIDTH = 16;
    const FRAME_HEIGHT = 16;
    this.type = EntityType.Handlebar;
    this.points = [
        {x: 4, y: 1},
        {x: 10, y: 1},
        {x: 10, y: 16},
        {x: 4, y: 16},
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    
    this.isActive = false;
    let currentAnimation = new SpriteAnimation('idle', handlebar, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true);
    this.collisionBody = new AABBCollider(this.points);

    this.activate = function(x, y) {
        this.isActive = true;

        this.position.x = Math.round(x - 3);
        this.position.y = Math.round(y + 10);

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

        this.position.x = Math.round(playerPos.x - 3);
        this.position.y = Math.round(playerPos.y + 10);

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function() {
        if(this.isActive) {
            currentAnimation.drawAt(Math.round(this.collisionBody.center.x - 8), Math.round(this.collisionBody.center.y - 9));
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(isEnemy(otherEntity)) {
            player.didPogoEnemy();
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