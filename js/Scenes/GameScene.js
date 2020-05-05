//Game Play scene
function GameScene() {
    const enemies = [];
    this.transitionIn = function() {
        if(player === null) {
            player = new Player();
        }

        if(enemies.length === 0) {
            enemies.push(new BikerEnemy(canvas.width / 4, canvas.height / 2));
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
            case KEY_P:
                for(key of pressedKeys) {
                    if(key === newKeyEvent) {
                        return;
                    }
                }
                
                if(pressed) {
                    SceneState.setState(SCENE.PAUSE);
                }
                return true;
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
        for(enemy of enemies) {
            enemy.update(deltaTime, player);
        }
    }

    const draw = function(deltaTime) {
        drawRect(0, 0, canvas.width, canvas.height, 'black');

        player.draw(deltaTime);
        for(enemy of enemies) {
            enemy.draw(deltaTime);
        }
    }
}