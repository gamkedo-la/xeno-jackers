//Health.js
function health(posX, posY) {
    const WIDTH = 18;
    const HEIGHT = 18;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const FRAME_NUM = 0; //TODO: restore after testing complete
    
    let animation = new SpriteAnimation('idle', healthpickup, [0, 1, 2, 3], WIDTH, HEIGHT, [256], false, true);
    //TODO: Restore once we know which image we want
//    let animation = new SpriteAnimation('idle', healthpickup, [FRAME_NUM], WIDTH, HEIGHT, [512], false, true);
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    this.health = 2;
    this.type = EntityType.Health;

    this.collisionBody = new AABBCollider([
        {x:posX, y:posY}, 
        {x:posX + WIDTH, y:posY}, 
        {x:posX + WIDTH, y:posY + HEIGHT}, 
        {x:posX, y:posY + HEIGHT} 
    ]);

    this.update = function(deltaTime) {
        animation.update(deltaTime);
        
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;
        
        if(this.collisionBody.isOnScreen) {
            position.x += Math.round(velocity.x * deltaTime / 1000);
            velocity.y += Math.round(GRAVITY * deltaTime / 1000);
            position.y += Math.round(velocity.y * deltaTime / 1000);
        }

        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function(deltaTime) {
        animation.drawAt(position.x, position.y);

        //colliders only draw when DRAW_COLLIDERS is set to true
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            SceneState.scenes[SCENE.GAME].removeMe(this);
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move health object the full amount of the overlap
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                position.x += collisionData.deltaX;
            } else {
                position.y += collisionData.deltaY;
                if(collisionData.deltaY < 0) {
                    velocity.y = 0;
                }
            }

            this.collisionBody.setPosition(position.x, position.y);
        }
    };
}