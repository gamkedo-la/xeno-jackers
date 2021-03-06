//UpgradePickup.js
function UpgradePickup(type, posX, posY) {
    const WIDTH = 18;
    const HEIGHT = 18;
    const SIZE = {width:WIDTH, height:HEIGHT};

    let animation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    this.type = type;

    //TODO: Need the right animation sheet and frames
    const getAnimationDataForType = function(type) {
        const animationData = {
            name:'idle',
            sheet:chainPickup,
            frames:[1, 2, 3],
            width:16,
            height:16,
            times:[64],
            reverses:false,
            loops:true
        };

        //TODO: Make changes to the default values as necessary
        switch(type) {
            case EntityType.ChainPickup:
                break;
            case EntityType.WheelPickup:
                animationData.sheet = wheelPickup;
                animationData.frames = [0, 1, 2, 3];
                break;
            case EntityType.HandlebarPickup:
                animationData.sheet = handlebarPickup;
                animationData.frames = [0, 1, 2, 3];
                break;
            case EntityType.EnginePickup:
                animationData.sheet = enginePickup;
                animationData.frames = [0, 1, 2, 3];
                break;
                    }

        return animationData;
    };
    const animationData = getAnimationDataForType(this.type);
    animation = new SpriteAnimation(animationData.name, animationData.sheet, animationData.frames, animationData.width, animationData.height, animationData.times, animationData.reverses, animationData.loops);

    this.collisionBody = new AABBCollider([
        {x:posX, y:posY}, 
        {x:posX + animationData.width, y:posY}, 
        {x:posX + animationData.width, y:posY + animationData.height}, 
        {x:posX, y:posY + animationData.height} 
    ]);

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime) {
        animation.update(deltaTime);
        
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;
        
        if(this.collisionBody.isOnScreen) {
            //position.x += Math.round(velocity.x * deltaTime / 1000);
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