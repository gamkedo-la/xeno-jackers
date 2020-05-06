//GameUI.js
function GameUI(canvas, context) {
    let playerHealth = 0;
    const HEALTH_X = canvas.width * 0.35 + 20;
    const TOP = canvas.height - (GAME_SCALE * statusbarBase.height);

    this.update = function(deltaTime, player) {
        playerHealth = player.health;
    };

    this.draw = function(deltaTime) {
        context.drawImage(statusbarBase, //image
            0, 0, //x, y to start clipping from image
            statusbarBase.width, statusbarBase.height, //width, height to clip from image
            0, TOP, //x, y for where to draw
            statusbarBase.width * GAME_SCALE, statusbarBase.height * GAME_SCALE); //width, height for drawing

            for(let i = 0; i < playerHealth; i++) {
                context.drawImage(healthSegment, 
                    0, 0, 
                    healthSegment.width, healthSegment.height, 
                    HEALTH_X + i * (healthSegment.width + 1) * GAME_SCALE, TOP + 8,
                    healthSegment.width * GAME_SCALE, healthSegment.height * GAME_SCALE);
            }
    };
}