//CrawlerEnemy.js
function CrawlerEnemy(posX, posY) {
    const WIDTH = 30;
	const ANIM_WIDTH = 30
    const HEIGHT = 10;
    const SIZE = {width:WIDTH, height:HEIGHT};
    const HEALTH_DROP_PROBABILITY = 30;
    const FLASH_TIME = 300;
    const WALK_SPEED = 30;
    
    let currentAnimation;
    let position = {x:posX, y:posY};
    let velocity = {x:0, y:0};

    let flipped = false;

    let flashTimer = FLASH_TIME;

    this.type = EntityType.EnemyCrawler;
    this.health = 1;

    this.collisionBody = new AABBCollider([
        {x:posX + 1, y:posY + 2}, //top left +2/+3 to make collision box smaller than sprite
        {x:posX + 29, y:posY + 2}, //top right +21/+3 makes collision box smaller than sprite
        {x:posX + 29, y:posY + HEIGHT}, //bottom right +21/+32 makes collision box smaller than sprite
        {x:posX + 1, y:posY + HEIGHT} //bottom left +2/+32 makes collision box smaller than sprite
    ]);

    this.getSize = function() {
        return SIZE;
    };

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.setPosition = function (x, y) {
        position.x = x;
        position.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime, player) {
        currentAnimation.update(deltaTime);
        position.x -= canvas.deltaX;
        position.y -= canvas.deltaY;

        if(currentAnimation === animations.death) {
            if(currentAnimation.getIsFinished()) {
                SceneState.scenes[SCENE.GAME].removeMe(this);
            }
            return;
        }

        if(this.collisionBody.isOnScreen) {
            if(flashTimer < FLASH_TIME) {
                flashTimer += deltaTime;
                if(Math.floor(flashTimer / 100) % 2 === 0) {
                    currentAnimation.useBrightImage = !currentAnimation.useBrightImage;
                }
            } else {
                flashTimer = FLASH_TIME;
                currentAnimation.useBrightImage = false;
            }

            const xPos = position.x + Math.round(velocity.x * deltaTime / 1000);

            velocity.y += GRAVITY * deltaTime / 1000;
            if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
            const yPos = position.y + Math.round(velocity.y * deltaTime / 1000);

            this.setPosition(xPos, yPos);

            let distToPlayer = 0;
            if(player.collisionBody.center.x < this.collisionBody.center.x) {
                flipped = true;
                moveLeft();
            } else {
                flipped = false;
                moveRight();
            }
        }
        //keep collisionBody in synch with sprite
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    const moveLeft = function() {
        velocity.x = -WALK_SPEED;
    };

    const moveRight = function() {
        velocity.x = WALK_SPEED;
    };

    this.draw = function(deltaTime) {
        if(this.collisionBody.isOnScreen) {
            if(currentAnimation === animations.death) {
                currentAnimation.drawAt(position.x + 7, position.y - 3, flipped);
            } else {
                currentAnimation.drawAt(position.x, position.y - 2, flipped);
            }

            //colliders only draw when DRAW_COLLIDERS is set to true
            this.collisionBody.draw();    
        }
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if(otherEntity.type === EntityType.Player) {
            if(otherEntity.collisionBody.center.x >= this.collisionBody.center.x) {
                position.x -= 5;
            } else {
                position.x += 5;
            }
        } else if(isPlayerTool(otherEntity) && otherEntity.isActive) {
            this.health--;
            if((this.health <= 0) && (currentAnimation !== animations.death)) {
                const healthDropChance = 100 * Math.random();
                if(healthDropChance < HEALTH_DROP_PROBABILITY) {
                    SceneState.scenes[SCENE.GAME].addHealthDrop(position.x, position.y);
                }
                currentAnimation = animations.death;
                flashTimer = FLASH_TIME;
                currentAnimation.useBrightImage = false;
            } else if(currentAnimation === animations.death) {
                // do nothing
            } else if(this.health > 0) {
                flashTimer = 0;
            }
        } else if(isEnvironment(otherEntity)) {
            //Environment objects don't move, so need to move biker enemy the full amount of the overlap
            if(Math.abs(collisionData.deltaX) < Math.abs(collisionData.deltaY)) {
                this.setPosition(position.x + collisionData.deltaX, position.y);
            } else {
                this.setPosition(position.x, position.y + collisionData.deltaY);
                if(collisionData.deltaY < 0) {
                    isOnGround = true;
                    velocity.y = 0;
                }
            }

            this.collisionBody.setPosition(position.x, position.y);
        }
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.walk = new SpriteAnimation('walking', enemyCrawlerSheet, [0, 1, 2, 3, 4], ANIM_WIDTH, HEIGHT, [256], false, true, [0], enemyCrawlerBrightSheet);
        anims.death = new SpriteAnimation('death', deathSheet, [0, 1, 2, 3], 16, 16, [100], false, false);
        
        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.walk;
}