//EnvironmentCollider.js
function EnvironmentCollider(points, position) {
    this.type = EntityType.Ground;
    this.points = [];
    this.position = {x:points[0].x + position.x, y:points[0].y + position.y};
    
    for(let point of points) {
        this.points.push({x:point.x + position.x, y:point.y + position.y});
    }
    this.collisionBody = new Collider(ColliderType.Polygon, this.points, position);
    this.update = function(deltaTime) {
        this.position.x -= canvas.deltaX;
        this.position.y -= canvas.deltaY;
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