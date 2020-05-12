//EnvironmentCollider.js
function EnvironmentCollider(points, position) {
    this.type = EntityType.Ground;
    this.collisionBody = new Collider(ColliderType.Polygon, points, position);
    this.didCollideWith = function(otherEntity) {
        console.log("Did collide with the ground");
        //do nothing?
    };
}