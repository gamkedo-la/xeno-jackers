//JukeBox.js
function JukeBox(posX, posY) {
    this.type = EntityType.JukeBox;
    const position = {x:posX, y:posY};
    let spawnPoint = {x:0, y:0};
    const TIME_DELAY = 100;
    const FLASH_TIME = 300;

    let flashTimer = FLASH_TIME;
    let lastTime = null;

    const idleAnimation = new SpriteAnimation('idle', jukeboxPic, [0, 1, 2, 3], 34, 32, [256], false, true, [0], jukeboxBrightSheet);
    const hitAnimation = new SpriteAnimation('hit', jukeboxPic, [4], 34, 32, [256], false, false, [0], jukeboxBrightSheet);
    let currentAnimation = idleAnimation;
    this.collisionBody = new AABBCollider([
        {x:posX + 1, y:posY},
        {x:posX + 32, y:posY},
        {x:posX + 32, y:posY + 32},
        {x:posX + 1, y:posY + 32}
    ]);

    this.setSpawnPoint = function(x, y) {
        position.x = x;
        position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(position.x, position.y);
        this.collisionBody.calcOnscreen(canvas);
    };

    this.update = function(deltaTime) {
        position.x = spawnPoint.x - canvas.offsetX;
        position.y = spawnPoint.y - canvas.offsetY;

        const bump = 100 * Math.random();
        if(bump < 10) {
            if(position.y < spawnPoint.y) {
                position.y++;
            } else {
                position.y--;
            }
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

            currentAnimation.update(deltaTime);
            if((currentAnimation === hitAnimation) && (currentAnimation.getIsFinished())) currentAnimation = idleAnimation;    
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
            const nowTime = Date.now();
            if((lastTime === null) || (nowTime - lastTime >= TIME_DELAY)) {
                lastTime = nowTime;
                flashTimer = 0;
                currentAnimation = hitAnimation;
                switch(currentBackgroundMusic.filenameWithPath) {
                    case MENU_MUSIC_FILENAME:
                        currentBackgroundMusic.loopSong(LEVEL_1_MUSIC_FILENAME);
                    break;
                    case LEVEL_1_MUSIC_FILENAME:
                        currentBackgroundMusic.loopSong(LEVEL_2_MUSIC_FILENAME);
                    break;
                    case LEVEL_2_MUSIC_FILENAME:
                        currentBackgroundMusic.loopSong(LEVEL_3_MUSIC_FILENAME);
                    break;
                    case LEVEL_3_MUSIC_FILENAME:
                        currentBackgroundMusic.loopSong(MENU_MUSIC_FILENAME);
                    break;
                }
            }
        }
    }
}