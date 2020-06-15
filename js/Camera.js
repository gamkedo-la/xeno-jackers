//Camera.js
function Camera(canvas) {
    const DEAD_ZONE_X = 8; //16
    const LOWER_DEAD_ZONE = 32;
    const UPPER_DEAD_ZONE = 12;
    canvas.center.x = canvas.width / 2;
    canvas.center.y = canvas.height / 2;
    let levelWidth = 0;
    let levelHeight = 0;

    this.setLevelWidth = function(newWidth) {
        levelWidth = newWidth;
    };

    this.setLevelHeight = function(newHeight) {
        levelHeight = newHeight;
    };

    this.setStartPos = function(x, y) {
        canvas.center.x = x;
        canvas.center.y = y;
        canvas.offsetX = 0;
        canvas.offsetY = 0;
    };

    this.update = function(player) {
        const oldX = canvas.center.x;
        const oldY = canvas.center.y;

        const playerPos = player.getPosition();
        const feet = playerPos.y + player.collisionBody.height;

        if(playerPos.x + 6 > canvas.center.x + DEAD_ZONE_X) {
            canvas.center.x = playerPos.x + 6 - DEAD_ZONE_X;
        } else if(playerPos.x + 6 < canvas.center.x - DEAD_ZONE_X) {
            canvas.center.x = playerPos.x + 6 + DEAD_ZONE_X;
        }

        if(feet > canvas.center.y + (canvas.height / 2) - LOWER_DEAD_ZONE) {
            canvas.center.y = feet - (canvas.height / 2) + LOWER_DEAD_ZONE;
        } else if(feet + UPPER_DEAD_ZONE < canvas.center.y) {
            canvas.center.y = feet + UPPER_DEAD_ZONE;
        }

        canvas.deltaX = canvas.center.x - oldX;
        canvas.deltaY = canvas.center.y - oldY;
        canvas.offsetX += canvas.deltaX;
        canvas.offsetY += canvas.deltaY;
    };
}