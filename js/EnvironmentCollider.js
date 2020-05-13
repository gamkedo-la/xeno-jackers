//EnvironmentCollider.js
function EnvironmentCollider(points, position) {
    this.type = EntityType.Ground;
    this.points = [];
    for(let point of points) {
        this.points.push({x:point.x + position.x, y:point.y + position.y});
    }
    this.collisionBody = new Collider(ColliderType.Polygon, this.points, position);

    this.didCollideWith = function(otherEntity) {
//        console.log("Did collide with the ground");
        //do nothing?
    };
}