//TitleScene
function TitleScene() {
    const mainMenuX = 160;
    const mainMenuY = 240;
    const buttonHeight = 36;
    const buttonTitlePadding = 0;

    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME,
        SCENE.OPTIONS,
    ];

    const buttons = [];

    this.transitionIn = function() {
        if(buttons.length === 0) {
            //add these in the same order as the selections array above
            buttons.push(buildPlayButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding));
            buttons.push(buildOptionsButton(mainMenuX, mainMenuY + 40, buttonHeight, buttonTitlePadding));
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
                console.log("Activated the current button");
                SceneState.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.SELECT2:
                console.log("Selected the Play button");
//                SceneState.setState(SCENE.GAME);
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("START", x, y, height, padding, thisClick, Color.Red);
    }

    const buildHelpButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.HELP);
        }

        return new UIButton("HELP", x, y, height, padding, thisClick, Color.Green);
    }

    const buildOptionsButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Options Button");
            SceneState.setState(SCENE.OPTIONS);
        }

        return new UIButton("OPTIONS", x, y, height, padding, thisClick, Color.Aqua);
    }

    const buildCreditsButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Credits Button");
            SceneState.setState(SCENE.CREDITS);
        }

        return new UIButton("CREDITS", x, y, height, padding, thisClick, Color.Purple);
    }

    const checkButtons = function() {
        let wasClicked = false;
        for(let button of buttons) {
            wasClicked = button.respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    }
    
    const drawMenu = function() {
        for(let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.draw();

            const buttonBounds = button.getBounds();
            if(i === selectorPositionsIndex) {
                canvasContext.drawImage(onMenuButton, 0, 0, onMenuButton.width, onMenuButton.height, buttonBounds.x - 20, buttonBounds.y + 10, GAME_SCALE * onMenuButton.width, GAME_SCALE * onMenuButton.height);
            } else {
                canvasContext.drawImage(offMenuButton, 0, 0, offMenuButton.width, offMenuButton.height, buttonBounds.x - 20, buttonBounds.y + 10, GAME_SCALE * offMenuButton.width, GAME_SCALE * offMenuButton.height);
            }
        }
	}
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();

        // render menu
        canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, mainMenuX - 35, mainMenuY - 10, uiMenuBorderPic.width * GAME_SCALE, uiMenuBorderPic.height * GAME_SCALE);
//        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
        drawMenu();        
	}
	
	const drawBG = function() {
        canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
    }
        
    return this;
};