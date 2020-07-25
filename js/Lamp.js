//Lamp.js
function Lamp(posX, posY) {
    this.type = EntityType.Lamp;
    let position = {x:posX, y:posY};
    let spawnPoint = {x:0, y:0};
    let currentAnimation = new SpriteAnimation('idle', lampPic, [0, 1], 16, 16, [256], false, true);
    this.collisionBody = new AABBCollider([
        {x:posX + 2, y:posY},
        {x:posX + 12, y:posY},
        {x:posX + 12, y:posY + 12},
        {x:posX + 2, y:posY + 12}
    ]);

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y - 15;
        spawnPoint.x = x;
        spawnPoint.y = y - 15;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime) {
        position.x = spawnPoint.x - canvas.offsetX;
        position.y = spawnPoint.y - canvas.offsetY;
        if(this.collisionBody.isOnScreen) {
            currentAnimation.update(deltaTime);
        }
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function() {
        if(this.collisionBody.isOnScreen) {
            currentAnimation.drawAt(position.x - 3, position.y - 2);

            //colliders only draw when DRAW_COLLIDERS is set to true
            this.collisionBody.draw();    
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(isPlayerTool(otherEntity)) {
            SceneState.scenes[SCENE.GAME].removeMe(this);
            SceneState.scenes[SCENE.GAME].addHealthDrop(position.x, position.y);
        }
    }
}