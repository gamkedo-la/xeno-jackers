
function EnemyMech(startX, startY) {
    
    console.log("Spawning a mech at "+startX+","+startY);

    this.update = function (deltaTime) {
    };

    this.draw = function (deltaTime) {
        // this is offset in a very strange way - FIXME YUCK
        canvasContext.drawImage(enemyMechSpriteSheet,0,0,64,36,startX-canvas.center.x+canvas.width/2-42,startY-canvas.center.y+canvas.height/2-2,64,36);
    };
}