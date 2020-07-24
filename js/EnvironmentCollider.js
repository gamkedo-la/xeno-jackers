//EnvironmentCollider.js
function EnvironmentCollider(type, points, position) {
    this.type = type;
    this.points = [];
    this.position = {x:points[0].x + position.x, y:points[0].y + position.y};
    let spawnPoint = {x:0, y:0};
    const TIME_DELAY = 100;
    let lastTime = null;

    this.setSpawnPoint = function(x, y) {
        this.position.x = x;
        this.position.y = y;
        spawnPoint.x = x;
        spawnPoint.y = y;
        this.collisionBody.setPosition(position.x, position.y);
    };
    
    for(let point of points) {
        this.points.push({x:point.x + position.x, y:point.y + position.y});
    }
    this.collisionBody = new AABBCollider(this.points);
    this.update = function(deltaTime) {
        this.position.x = spawnPoint.x - canvas.offsetX;
        this.position.y = spawnPoint.y - canvas.offsetY;
        this.collisionBody.setPosition(this.position.x, this.position.y);
    };

    this.draw = function() {
        this.collisionBody.draw();
    };

    this.didCollideWith = function(otherEntity, collisionData) {
        if((isPlayerTool(otherEntity)) && (this.type === EntityType.JukeBox)) {
            const nowTime = Date.now();
            if((lastTime === null) || (nowTime - lastTime >= TIME_DELAY)) {
                lastTime = nowTime;
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
    };
}