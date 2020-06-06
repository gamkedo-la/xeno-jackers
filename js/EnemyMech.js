
function EnemyMech(startX, startY) {
    
    console.log("Spawning a mech at "+startX+","+startY); // FIXME offsets hardcoded
    
    let w = 36;
    let h = 36;
    let attackDistance = 30;
    let flipped = false;
    let anims = {
        idle: new SpriteAnimation('idle', enemyMechSpriteSheet, [0,1,2,3,4,5,6,7,8,9], w, h, [100], false, true),
        punch: new SpriteAnimation('punch', enemyMechSpriteSheet, [10,11,12,13,14,15,16], w, h, [100], false, true),
    };
    let currentAnimation = anims.idle; 
    let position = {x:startX,y:startY};
    this.type = EntityType.EnemyMech;
    this.health = 1;

    this.collisionBody = new AABBCollider([
        {x:startX + 2, y:startY + 3},
        {x:startX + 21, y:startY + 3},
        {x:startX + 21, y:startY + h},
        {x:startX + 2, y:startY + h}
    ]);

    this.setSpawnPoint = function(x, y) {
        //temp to prevent crashes
    };

    this.update = function (deltaTime, player) {
        currentAnimation.update(deltaTime); // without this the animation is stuck
    };

    this.draw = function (deltaTime) {
        // note: positions are offset in a very strange way
        var cameraOffsetX = canvas.center.x-canvas.width/2;
        var cameraOffsetY = canvas.center.y-canvas.height/2;
        var playerX = player.getPosition().x; // ??
        var lookingRight = playerX > position.x - 36; // FIXME hardcoded offset
        var dist = Math.abs(playerX - position.x + 36);
        if (dist < attackDistance) {
            currentAnimation = anims.punch;
        } else {
            currentAnimation = anims.idle;
        }
        currentAnimation.drawAt(position.x-cameraOffsetX, position.y-cameraOffsetY, lookingRight);
        //this.collisionBody.draw();
    };
}