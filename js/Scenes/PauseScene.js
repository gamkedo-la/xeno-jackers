//PauseScene.js
function PauseScene() {
    let mainMenuX;
    const mainMenuY = 60;
    const buttonHeight = 9;
    const buttonTitlePadding = 0;

    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME,
        SCENE.OPTIONS,
        SCENE.TITLE
    ];

    const buttons = [];

    this.transitionIn = function() {        
        mainMenuX = Math.round(canvas.width / 2 - fontRenderer.getWidthOfText("PAUSED", 1, FONT.White) / 2);//PAUSED is longest button title

        if(buttons.length === 0) {
            //add these in the same order as the selections array above
            buttons.push(buildResumeButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));
            buttons.push(buildOptionsButton(mainMenuX, Math.round(mainMenuY + 1.5 * buttonHeight), buttonHeight, buttonTitlePadding));
            buttons.push(buildQuitButton(mainMenuX, mainMenuY + 3 * buttonHeight, buttonHeight, buttonTitlePadding));
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
        
        if(newKeyEvent === KEY_P && pressed) {
            resumeSound.play();
            SceneState.setState(SCENE.GAME);
        }

        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        switch (newKeyEvent) {
            case KEY_UP:
            case KEY_LEFT:
                selectorPositionsIndex--;
                if (selectorPositionsIndex < 0) {
                    selectorPositionsIndex += selections.length;
                }
                return true;
            case KEY_DOWN:
            case KEY_RIGHT:
                selectorPositionsIndex++;
                if (selectorPositionsIndex >= selections.length) {
                    selectorPositionsIndex = 0;
                }
                return true;
            case ALIAS.SELECT1:
                SceneState.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;
            case KEY_Q:
                SceneState.setState(SCENE.TITLE);
                return true;
            case KEY_O:
                SceneState.setState(SCENE.OPTIONS);
                return true;
            }
        
        return false;
    };

    const buildResumeButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("RESUME", x, y, height, padding, thisClick, Color.Red);
    };

    const buildOptionsButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.OPTIONS);
        }

        return new UIButton("OPTIONS", x, y, height, padding, thisClick, Color.Red);
    };

    const buildQuitButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.TITLE);
        }

        return new UIButton("QUIT", x, y, height, padding, thisClick, Color.Red);
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

            const buttonBounds = button.getBounds();
            if(i === selectorPositionsIndex) {
                canvasContext.drawImage(onMenuButton, 0, 0, onMenuButton.width, onMenuButton.height, buttonBounds.x - 5, buttonBounds.y + 2, GAME_SCALE * onMenuButton.width, GAME_SCALE * onMenuButton.height);
            } else {
                canvasContext.drawImage(offMenuButton, 0, 0, offMenuButton.width, offMenuButton.height, buttonBounds.x - 5, buttonBounds.y + 2, GAME_SCALE * offMenuButton.width, GAME_SCALE * offMenuButton.height);
            }
        }
	}
	
	const update = function(deltaTime) {

	};
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();

        drawTitle();
        drawMenu();
	};
	
	const drawBG = function() {
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
};

    const drawTitle = function() {
        const titleWidth = fontRenderer.getWidthOfText("- P A U S E D -", 1, FONT.Stroked);
        fontRenderer.drawString(canvasContext,  Math.round(canvas.width / 2 - titleWidth / 2), canvas.height / 4, "- P A U S E D -", FONT.Stroked, 1);
    };
        
    return this;
};