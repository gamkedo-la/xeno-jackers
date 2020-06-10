//ChainWhip.js
function ChainWhip() {
    this.type = EntityType.Chain;
    this.points = [
        {x: 0, y: 0},
        {x: 53, y: 0},
        {x: 53, y: 7},
        {x: 0, y: 7},
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    this.isActive = false;

    this.setSpawnPoint = function(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);

    };

    this.collisionBody = new AABBCollider(this.points);

    this.activate = function(x, y) {
        this.isActive = true;

        const deltaX = x - this.points[0].x - canvas.center.x;
        const deltaY = y - this.points[0].y - canvas.offsetY;

        for(let point of this.points) {
            point.x += deltaX;
            point.y += deltaY;
        }

        this.position.x = this.points[0].x;
        this.position.y = this.points[0].y;

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
        SceneState.scenes[SCENE.GAME].addCollisionEntity(this);
    };

    this.deactivate = function() {
        this.isActive = false;
        SceneState.scenes[SCENE.GAME].removeCollisionEntity(this);
    };

    this.draw = function() {
        if(this.isActive) {
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        this.deactivate();
    };
}