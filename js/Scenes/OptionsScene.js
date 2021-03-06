//Options Scene
function OptionsScene() {
    let selectorPositionsIndex = 0;
    const selections = [
        SCENE.GAME
    ];
    const buttonHeight = 25;
    const buttonTitlePadding = 2;
    const buttons = [];
    const volumeY = 50;
    let volumeTextWidth = 0;
    const palletPos = {x: 0, y: 0};
    const palletLabelPos = {x: 0, y: 0};
    this.transitionIn = function() {
        let mainMenuX = Math.round(canvas.width - fontRenderer.getWidthOfText("MAIN MENU", 1, FONT.White) - 0);
        const mainMenuY = canvas.height - fontRenderer.getHeightOfText(1, FONT.White) + 0;
        const gameboyWidth = fontRenderer.getWidthOfText("GAMEBOY", 1, FONT.Stroked);
        palletPos.x = Math.round((canvas.width - gameboyWidth) / 2);
        palletPos.y = volumeY + 30;
        palletLabelPos.x = Math.round((canvas.width - fontRenderer.getWidthOfText("PALETTE", 1, FONT.White)) / 2);
        palletLabelPos.y = volumeY + 20;
        
        if(buttons.length === 0) {
            buttons.push(buildMenuButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding, GAME_SCALE));
            buttons.push(buildVolumeUpButton(56, volumeY, buttonHeight, buttonTitlePadding, GAME_SCALE));
            buttons.push(buildVolumeDownButton(96, volumeY, buttonHeight, buttonTitlePadding, GAME_SCALE));
            buttons.push(buildPrevPaletteButton(palletPos.x - 6, palletPos.y + 1, buttonHeight, buttonTitlePadding, GAME_SCALE));
            buttons.push(buildNextPaletteButton(palletPos.x + gameboyWidth, palletPos.y + 1, buttonHeight, buttonTitlePadding, GAME_SCALE));
        }

        selectorPositionsIndex = 0;

        volumeTextWidth = fontRenderer.getWidthOfText("VOLUME", 1, FONT.White);
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
                turnVolumeUp();
                return true;
            case ALIAS.LEFT:
                prevPallete();
                return true;
            case ALIAS.DOWN:
                turnVolumeDown();
                return true;
            case ALIAS.RIGHT:
                nextPallete();
                return true;
            case ALIAS.SELECT1:
                SceneState.setState(selections[selectorPositionsIndex]);
                return true;
            case ALIAS.SELECT2:
                SceneState.setState(SCENE.TITLE);
            case ALIAS.POINTER:
                checkButtons();
                return true;
		    case KEY_ESCAPE:
				SceneState.setState(SCENE.TITLE);
				return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        palletPos.x = Math.round((canvas.width - fontRenderer.getWidthOfText(paletteString, 1, FONT.Stroked)) / 2);
        palletPos.y = volumeY + 30;
    };

    const checkButtons = function() {
        let wasClicked = false;
        for(let i = 0; i < buttons.length; i++) {
            wasClicked = buttons[i].respondIfClicked(mouseX, mouseY);
            if(wasClicked) {break;}
        }
    };

    const buildMenuButton = function(x, y, height, padding, scale) {
        const thisClick = function() {
            SceneState.setState(SCENE.TITLE);
        }

        return new UIButton("MAIN MENU", x, y, height, padding, thisClick, Color.Aqua, scale);
    };

    const buildVolumeUpButton = function(x, y, height, padding, scale) {
        const thisClick = function() {
            turnVolumeUp();
        }

        return new UIButton("+", x, y, height, padding, thisClick, Color.Aqua, scale);
    }

    const buildVolumeDownButton = function(x, y, height, padding, scale) {
        const thisClick = function() {
            turnVolumeDown();
        }

        return new UIButton("-", x, y, height, padding, thisClick, Color.Aqua, scale);
    }

    const buildNextPaletteButton = function(x, y, height, padding, scale) {
        const thisClick = function() { nextPallete(); }
        return new UIButton(">", x, y, height, padding, thisClick, Color.Aqua, scale);
    }
    const buildPrevPaletteButton = function(x, y, height, padding, scale) {
        const thisClick = function() { prevPallete(); }
        return new UIButton("<", x, y, height, padding, thisClick, Color.Aqua, scale);
    }

    const printNavigation = function(navItems) {
        for(let i = 0; i < navItems.length; i++) {
            navItems[i].draw();
        }
	};

    const draw = function(deltaTime, buttons, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        drawTitle();

        drawVolume();

        drawPalette();
        
        // render menu
        printNavigation(buttons, selectorPositionIndex);        
    };
    
    const drawVolume = function() {
        const volumeLevelWidth = fontRenderer.getWidthOfText(`${Math.round(100 * musicVolume)}`, 1, FONT.Stroked);
        fontRenderer.drawString(canvasContext, Math.round((canvas.width - volumeTextWidth) / 2), volumeY - 10, "VOLUME", FONT.White);
        const volumeString = `${Math.round(musicVolume * 100)}`
        fontRenderer.drawString(canvasContext, Math.round((canvas.width - volumeLevelWidth) / 2), volumeY, volumeString, FONT.Stroked)
    };
	
    const drawPalette = function() {
        fontRenderer.drawString(canvasContext, palletLabelPos.x, palletLabelPos.y, "PALETTE", FONT.White);
        fontRenderer.drawString(canvasContext, palletPos.x , palletPos.y, paletteString, FONT.Stroked)
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