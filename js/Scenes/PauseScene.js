//PauseScene.js
function PauseScene() {
    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME,
    ];

    const buttons = [];

    this.transitionIn = function() {
        const mainMenuX = 235;
        const mainMenuY = 260;
        const buttonHeight = 36;
        const buttonTitlePadding = 0;
        
        if(buttons.length === 0) {
            //add these in the same order as the selections array above
            buttons.push(buildPlayButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));
        }

        selectorPositionsIndex = 0;
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
	    update(deltaTime);
	    
	    draw(deltaTime, selectorPositionsIndex);
    };

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        for(key of pressedKeys) {
            if(key === newKeyEvent) {
                return;
            }
        }
        
        if(pressed) {
            resumeSound.play();
            SceneState.setState(SCENE.GAME);
        }

/*        switch (newKeyEvent) {
            case ALIAS.SELECT1:
                console.log("Activated the current button");
                SceneState.setState(SCENE.GAME);
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }*/
        
        return true;
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("RESUME", x, y, height, padding, thisClick, Color.Red);
    };

    const checkButtons = function() {
        let wasClicked = false;
        for(let button of buttons) {
            wasClicked = button.respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    };
    
    const drawMenu = function() {

        for(let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.draw();
        }
	};
	
	const update = function(deltaTime) {

	};
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();

        // render menu
//        canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, 250, 200, uiMenuBorderPic.width * 2 * GAME_SCALE, uiMenuBorderPic.height * 4 * GAME_SCALE);
//        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
//        drawMenu();
	};
	
	const drawBG = function() {
        canvasContext.drawImage(pauseScreenPic, 0, 0, canvas.width, canvas.height);
    };
        
    return this;
};