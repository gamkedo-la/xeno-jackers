//Camera.js
function Camera(canvas) {
    const DEAD_ZONE_X = 16; //was 24
    const DEAD_ZONE_Y = 16;
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

    this.update = function(player) {
        const playerPos = player.getPosition();
        const playerSize = player.getSize();
        const oldX = canvas.center.x;

        console.log (playerPos);

        if(playerPos.x + playerSize.width/2 > canvas.center.x + DEAD_ZONE_X) {
            canvas.center.x = Math.round(playerPos.x + playerSize.width/2 - DEAD_ZONE_X);
        } else if(playerPos.x + playerSize.width/2 < canvas.center.x - DEAD_ZONE_X) {
            canvas.center.x = Math.round(playerPos.x + playerSize.width/2 + DEAD_ZONE_X);
        }

        if(canvas.center.x - canvas.width / 2 < 0) canvas.center.x = canvas.width / 2;
        if(canvas.center.x + canvas.width / 2 > levelWidth) canvas.center.x = levelWidth - canvas.width / 2;

        canvas.deltaX = canvas.center.x - oldX;
        
        const oldY = canvas.center.y;

        if(playerPos.y > canvas.center.y) {
            canvas.center.y = playerPos.y;
        } else if(playerPos.y < canvas.center.y - DEAD_ZONE_Y) {
            canvas.center.y = playerPos.y + DEAD_ZONE_Y;
        }
        
        if(canvas.center.y - canvas.height / 2 < 0) canvas.center.y = canvas.height / 2;
        if(canvas.center.y + canvas.height / 2 > levelHeight) canvas.center.y = levelHeight - canvas.height / 2;

        canvas.deltaY = canvas.center.y - oldY;
    };
}