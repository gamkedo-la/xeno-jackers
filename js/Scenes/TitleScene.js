//TitleScene
function TitleScene() {
	const MENU_BG_COLOR = "#010139";

    let selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    const selections = [
        SCENE.GAME,
        SCENE.HELP,
        SCENE.SETTINGS,
        SCENE.CREDITS
    ];

    this.transitionIn = function() {

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
        
        return false;
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Play Button");
            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("STRINGS_KEY.Play",
                        x, y, height, padding, thisClick, Color.Red);
    }

    const buildHelpButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Help Button");
            SceneState.setState(SCENE.HELP);
        }

        return new UIButton(STRINGS_KEY.Help, x, y, height, padding, thisClick, Color.Green);
    }

    const buildSettingsButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Settings Button");
            SceneState.setState(SCENE.SETTINGS);
        }

        return new UIButton(STRINGS_KEY.Settings, x, y, height, padding, thisClick, Color.Aqua);
    }

    const buildCreditsButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Credits Button");
            SceneState.setState(SCENE.CREDITS);
        }

        return new UIButton(STRINGS_KEY.Credits, x, y, height, padding, thisClick, Color.Purple);
    }

    const checkButtons = function() {
        let wasClicked = false;
        for(let i = 0; i < buttons.length; i++) {
            wasClicked = buttons[i].respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    }
    
    const printMenu = function(menuItems, selected) {
        for(let i = 0; i < menuItems.length; i++) {
            menuItems[i].draw();
        }
	}
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();

        // render menu
        canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, 200, 250, uiMenuBorderPic.width * GAME_SCALE, uiMenuBorderPic.height * GAME_SCALE);
        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
        //        printMenu(buttons, selectorPositionIndex);        
	}
	
	const drawBG = function() {
        canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
    }
        
    return this;
};