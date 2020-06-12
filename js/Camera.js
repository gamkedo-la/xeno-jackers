//Camera.js
function Camera(canvas) {
    const DEAD_ZONE_X = 0; //16
    const DEAD_ZONE_Y = 8; //16
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

        if(playerPos.x > canvas.center.x + DEAD_ZONE_X) {
            canvas.center.x = playerPos.x - DEAD_ZONE_X;
        } else if(playerPos.x < canvas.center.x - DEAD_ZONE_X) {
            canvas.center.x = playerPos.x + DEAD_ZONE_X;
        }

        if(playerPos.y > canvas.center.y + DEAD_ZONE_Y) {
            canvas.center.y = playerPos.y - DEAD_ZONE_Y;
        } else if(playerPos.y < canvas.center.y - DEAD_ZONE_Y) {
            canvas.center.y = playerPos.y + DEAD_ZONE_Y;
        }

        canvas.deltaX = canvas.center.x - oldX;
        canvas.deltaY = canvas.center.y - oldY;
        canvas.offsetX += canvas.deltaX;
        canvas.offsetY += canvas.deltaY;
    };
}