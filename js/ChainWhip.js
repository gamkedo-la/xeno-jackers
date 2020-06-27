//ChainWhip.js
// anchored to Player.js in "function updateAttacking(deltaTime)"
function ChainWhip() {
    this.type = EntityType.Chain;
    this.points = [
        {x: 0, y: 0},// 0,0
        {x: 53, y: 0},// 53,0
        {x: 53, y: 7},// 53,7
        {x: 0, y: 7},// 0,7
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    let spawnPoint = {x:0, y:0};
    this.isActive = false;

    this.setSpawnPoint = function(x, y) {
        this.position.x = x;
        this.position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);

    };

    this.collisionBody = new AABBCollider(this.points);

    this.activate = function(x, y) {
        this.isActive = true;

        const deltaX = x - this.position.x;
        const deltaY = y - this.position.y;

        this.position.x = x;
        this.position.y = y;

        for (let point of this.points) {
            point.x += deltaX;
            point.y += deltaY;
        }

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
        if(otherEntity.type != EntityType.Player) {
            this.deactivate();
        }
    };
}