
function EnemyMech(startX, startY) {
    
    console.log("Spawning a mech at "+startX+","+startY); // FIXME offsets hardcoded
    
    let w = 36;
    let h = 36;
    let flipped = false;
    let currentAnimation = new SpriteAnimation('idle', enemyMechSpriteSheet, [0,1,2,3,4,5,6,7,8,9], w, h, [100], false, true);
    let position = {x:startX,y:startY};
    this.type = EntityType.EnemyMech;
    this.health = 1;
    
    // FIXME this is horrid and about to be replaced
    this.collisionBody = new Collider(ColliderType.Polygon, [
        {x:startX + 2, y:startY + 3},
        {x:startX + 21, y:startY + 3},
        {x:startX + 21, y:startY + h},
        {x:startX + 2, y:startY + h}
    ], {x:startX, y:startY});

    this.update = function (deltaTime, player) {
        currentAnimation.update(deltaTime); // without this the animation is stuck
    };

    this.draw = function (deltaTime) {
        // canvasContext.drawImage(enemyMechSpriteSheet,0,0,64,36,startX-canvas.center.x+canvas.width/2-42,startY-canvas.center.y+canvas.height/2-2,64,36);

        // this is offset in a very strange way - FIXME YUCK - WHY???
        // apparently biker entity x,y are changed when camera scrolls?!
        var cameraOffsetX = canvas.center.x+canvas.width/2;
        var cameraOffsetY = canvas.center.y+canvas.height/2;
        currentAnimation.drawAt(position.x-cameraOffsetX, position.y-cameraOffsetY, flipped);
        
        //this.collisionBody.draw();

    };
}