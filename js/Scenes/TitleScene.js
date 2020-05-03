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

    const buttons = [];

    this.transitionIn = function() {
        buttons.push(buildPlayButton(235, 260, 36, 2));
        buttons.push(buildOptionsButton(235, 300, 36, 2));
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
/*            case ALIAS.UP:
            case ALIAS.LEFT:
                selectorPositionsIndex--;
                if (selectorPositionsIndex < 0) {
                    selectorPositionsIndex += selections.length;
                }
                return true;
            case ALIAS.DOWN:
            case ALIAS.RIGHT:
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
                SceneState.setState(SCENE.GAME);*/
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Play Button");
//            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("START", x, y, height, padding, thisClick, Color.Red);
    }

    const buildHelpButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Help Button");
            SceneState.setState(SCENE.HELP);
        }

        return new UIButton(STRINGS_KEY.Help, x, y, height, padding, thisClick, Color.Green);
    }

    const buildOptionsButton = function(x, y, height, padding) {
        const thisClick = function() {
            console.log("Clicked the Options Button");
//            SceneState.setState(SCENE.SETTINGS);
        }

        return new UIButton("OPTIONS", x, y, height, padding, thisClick, Color.Aqua);
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
        for(let button of buttons) {
            wasClicked = button.respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    }
    
    const drawMenu = function() {
        for(button of buttons) {
            button.draw();
        }
	}
	
	const update = function(deltaTime) {

	}
	
	const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();

        // render menu
        canvasContext.drawImage(uiMenuBorderPic, 0, 0, uiMenuBorderPic.width, uiMenuBorderPic.height, 200, 250, uiMenuBorderPic.width * GAME_SCALE, uiMenuBorderPic.height * GAME_SCALE);
//        fontRenderer.drawString(canvasContext, 220, 260, "START", GAME_SCALE);
        drawMenu();        
	}
	
	const drawBG = function() {
        canvasContext.drawImage(titleScreenPic, 0, 0, canvas.width, canvas.height);
    }
        
    return this;
};