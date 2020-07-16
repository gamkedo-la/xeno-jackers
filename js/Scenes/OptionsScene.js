//Options Scene
function OptionsScene() {
    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME
    ];
    const buttonHeight = 25;
    const buttonTitlePadding = 2;
    const buttons = [];


    this.transitionIn = function() {
        let mainMenuX = Math.round(canvas.width - fontRenderer.getWidthOfText("MAIN MENU", 1, FONT.White) - 0);
        const mainMenuY = canvas.height - fontRenderer.getHeightOfText(1, FONT.White) + 0;
        
        if(buttons.length === 0) {
            buttons.push(buildMenuButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding, GAME_SCALE));
        }

        selectorPositionsIndex = 0;
    };

    this.transitionOut = function() {

    };

    this.run = function(deltaTime) {
        update(deltaTime);

        draw(deltaTime, buttons, selectorPositionsIndex);
    };

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (newKeyEvent) {
            case ALIAS.UP:
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
                SceneState.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.SELECT2:
                SceneState.setState(SCENE.GAME);
            case ALIAS.POINTER:
                checkButtons();
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {

    };

    const checkButtons = function() {
        let wasClicked = false;
        for(let i = 0; i < buttons.length; i++) {
            wasClicked = buttons[i].respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    };

    const buildPlayButton = function(x, y, height, padding) {
        const thisClick = function() {
            SceneState.setState(SCENE.GAME);
        }

        return new UIButton("PLAY", x, y, height, padding, thisClick, Color.Aqua);
    };

    const buildMenuButton = function(x, y, height, padding, scale) {
        const thisClick = function() {
            SceneState.setState(SCENE.TITLE);
        }

        return new UIButton("MAIN MENU", x, y, height, padding, thisClick, Color.Aqua, scale);
    };

    const printNavigation = function(navItems) {
        for(let i = 0; i < navItems.length; i++) {
            navItems[i].draw();
        }
	};

    const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        drawTitle();
        
        // render menu
        printNavigation(buttons, selectorPositionIndex);        
	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, "#252525");
    };
    
    const drawTitle = function() {
        const titleWidth = fontRenderer.getWidthOfText("OPTIONS", 1, FONT.Stroked);
        fontRenderer.drawString(canvasContext, Math.round(canvas.width / 2 - titleWidth / 2), Math.round(canvas.height / 8), "OPTIONS", FONT.Stroked, 1);
    };
}