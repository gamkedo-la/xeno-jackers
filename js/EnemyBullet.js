//EnemyBullet.js
function EnemyBullet() {
    const SPEED = 50;
    const WIDTH = 9;
    const HEIGHT = 9;
    this.type = EntityType.EnemyBullet;
    this.points = [
        {x: 0, y: 0},
        {x: 7, y: 0},
        {x: 7, y: 7},
        {x: 0, y: 7},
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    let velocity = {x: 0, y: 0};
    this.isActive = false;
    const currentAnimation = new SpriteAnimation('idle', flyingOrb, [0, 1, 2, 3], WIDTH, HEIGHT, [100], true, true);

    this.collisionBody = new AABBCollider(this.points);

    this.activate = function(x, y) {
        this.isActive = true;

        const deltaX = x - this.position.x;
        const deltaY = y - this.position.y;

        this.position.x = x;
        this.position.y = y;

        for (let point of this.points) {
            point.x += deltaX;
            point.y += deltaY;
        }

        const playerPos = player.getDrawPosition();
        const xOffset = Math.round(10 * Math.random()) - 5;
        const yOffset = Math.round(10 * Math.random()) - 5;
        velocity.x = playerPos.x - this.position.x + xOffset;
        velocity.y = playerPos.y - this.position.y + yOffset;
        velocity = normalize(velocity);
        velocity.x *= SPEED;
        velocity.y *= SPEED;

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime) {
        currentAnimation.update(deltaTime);
        this.position.x -= canvas.deltaX;
        this.position.y -= canvas.deltaY;

        this.position.x += (velocity.x * deltaTime / 1000);
        this.position.y += (velocity.y * deltaTime / 1000);
        
        if(!this.collisionBody.isOnScreen) {
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function() {
        currentAnimation.drawAt(Math.round(this.position.x), Math.round(this.position.y), false);
        if(this.isActive) {
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type !== EntityType.LevelExit) {
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }
    };
}