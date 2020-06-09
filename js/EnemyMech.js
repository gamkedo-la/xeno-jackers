
function EnemyMech(startX, startY) {
    
    console.log("Spawning a mech at "+startX+","+startY); // FIXME offsets hardcoded
    
    // private
    let w = 36;
    let h = 36;
    let flipped = false;
    let attackDistance = 30;
    let position = {x:startX,y:startY};
    let anims = {
        idle: new SpriteAnimation('idle', enemyMechSpriteSheet, [0,1,2,3,4,5,6,7,8,9], w, h, [100], false, true),
        punch: new SpriteAnimation('punch', enemyMechSpriteSheet, [10,11,12,13,14,15,16], w, h, [100], false, true),
    };
    let currentAnimation = anims.idle; 

    // public
    this.health = 1;
    this.type = EntityType.EnemyMech;
    this.collisionBody = new AABBCollider([
        {x:startX + 2, y:startY + 3},
        {x:startX + 21, y:startY + 3},
        {x:startX + 21, y:startY + h},
        {x:startX + 2, y:startY + h}
    ]);

    // FIXME this gets called with totally wrong values
    this.setSpawnPoint = function(x, y) {
        //position.x = x;
        //position.y = y;
        //this.collisionBody.setPosition(position.x, position.y);
        //this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function (deltaTime, player) {

        var playerX = player.getPosition().x; // FIXME: slow function call and new object every frame! GC
        flipped  = playerX > position.x - 8; // FIXME hardcoded offset
        
        var dist = Math.abs(playerX - position.x - 8);
        if (dist < attackDistance) {
            currentAnimation = anims.punch;
        } else {
            currentAnimation = anims.idle;
        }

        // without this the animation is stuck
        currentAnimation.update(deltaTime); 

        // silly to move this around every frame
        //this.collisionBody.setPosition(position.x, position.y);
        //this.collisionBody.calcOnscreen(canvas);

        // there's no reason for this
        //position.x -= canvas.deltaX;
        //position.y -= canvas.deltaY;
    };

    this.draw = function (deltaTime) {
        
        // nice and simple
        var onscreenX = position.x-canvas.center.x+canvas.width/2;
        var onscreenY = position.y-canvas.center.y+canvas.height/2;
        
        currentAnimation.drawAt(onscreenX, onscreenY, flipped);
        
        this.collisionBody.draw();

        // console.log("camera:"+canvas.center.x+","+canvas.center.y+" mech: "+position.x+","+position.y+" onscreen:"+onscreenX+","+onscreenY);

    };

    this.didCollideWith = function(otherEntity) {

    };
}