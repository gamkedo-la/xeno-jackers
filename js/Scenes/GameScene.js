//Game Play scene
function GameScene() {
    this.transitionIn = function() {
        if(player === null) {
            player = new Player();
        }
    }

    this.transitionOut = function() {

    }

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime);
    }

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        switch (newKeyEvent) {
/*            case ALIAS.JUMP:
                console.log("Jumping?");
                return true;
            case ALIAS.LEFT:
                console.log("Moving left?");
                player.moveLeft();
                return true;
            case ALIAS.CROUCH:
                console.log("Crouching?");
                return true;
            case ALIAS.RIGHT:
                console.log("Moving right?");
                player.moveRight();
                return true;
            case ALIAS.PUNCH:
                console.log("Punching?");
                return true;
            case ALIAS.KICK:
                console.log("Kicking?");*/
            case ALIAS.CHEATS:
                CHEATS_ACTIVE = !CHEATS_ACTIVE;
                return true;
            case ALIAS.DEBUG:
                DEBUG = !DEBUG;
                console.log("Debug? " + DEBUG);
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        player.update(deltaTime);
    }

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height, 'blue');
        canvasContext.drawImage(tempBackground, 0, 0, canvas.width, canvas.height);

        player.draw(deltaTime);
    }
}