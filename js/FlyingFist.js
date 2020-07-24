//EnemyFist.js
function FlyingFist(flipped) {
    const SPEED = 30;
    const WIDTH = 15;
    const HEIGHT = 9;
    this.type = EntityType.FlyingFist;
    this.points = [
        {x: 0, y: 0},
        {x: 12, y: 0},
        {x: 12, y: 7},
        {x: 0, y: 7},
    ];
    this.position = {x:this.points[0].x, y:this.points[0].y};
    this.isActive = false;
    this.dead = false;
    const animations = {
        idle: new SpriteAnimation('idle', flyingFist, [0, 1, 2], WIDTH, HEIGHT, [100], true, true),
        dead: new SpriteAnimation('death', deathSheet, [0, 1, 2, 3], 16, 16, [100], false, false)
    }
    let currentAnimation = animations.idle;

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

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime) {
        currentAnimation.update(deltaTime);
        this.position.x -= canvas.deltaX;
        this.position.y -= canvas.deltaY;

        if(flipped) {
            this.position.x += (SPEED * deltaTime / 1000);
        } else {
            this.position.x -= (SPEED * deltaTime / 1000);
        }
        
        if(!this.collisionBody.isOnScreen) {
            SceneState.scenes[SCENE.GAME].removeMe(this);
        }

        if(this.dead && currentAnimation != animations.dead) {
            currentAnimation = animations.dead;
            currentAnimation.reset();
        }

        if(currentAnimation === animations.dead && currentAnimation.getIsFinished()) {
            SceneState.scenes[SCENE.GAME].removeMe(this, true);
        }

        this.collisionBody.setPosition(this.position.x, this.position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.draw = function() {
        currentAnimation.drawAt(this.position.x, this.position.y, flipped);
        if(this.isActive) {
            this.collisionBody.draw();
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type !== EntityType.LevelExit) {
            this.dead = true;
        }
    };
}