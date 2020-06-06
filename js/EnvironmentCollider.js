//EnvironmentCollider.js
function EnvironmentCollider(points, position) {
    this.type = EntityType.Ground;
    this.points = [];
    this.position = {x:points[0].x + position.x, y:points[0].y + position.y};
    let spawnPoint = {x:0, y:0};

    this.setSpawnPoint = function(x, y) {
        this.position.x = x;
        this.position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(position.x, position.y);
    };
    
    for(let point of points) {
        this.points.push({x:point.x + position.x, y:point.y + position.y});
    }
    this.collisionBody = new AABBCollider(this.points);
    this.update = function(deltaTime) {
        this.position.x = spawnPoint.x - canvas.offsetX;
        this.position.y = spawnPoint.y - canvas.offsetY;
        this.collisionBody.setPosition(this.position.x, this.position.y);
    };

    this.draw = function() {
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
//        console.log("Did collide with the ground");
        //do nothing?
    };
}