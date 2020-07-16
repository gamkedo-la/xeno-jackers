//Credits Scene
function CreditsScene() {
    const buttonHeight = 25;//TODO: Adjust this size based on custom font
    const buttonTitlePadding = 2;
    const buttons = [];
    const SCROLL_SPEED = 20;

    let timeMultiplier = 1;
    let textYPos = 0;

    let gameCanvas;
    this.transitionIn = function() {
        gameCanvas = document.getElementById("gameCanvas");
        canvas.width = 640;
        canvas.height = 576;

        textYPos = canvas.height / 2;
        let mainMenuX = Math.round(canvas.width - fontRenderer.getWidthOfText("MAIN MENU", 1, FONT.White) - 0);
        const mainMenuY = canvas.height - fontRenderer.getHeightOfText(1, FONT.White) + 0;
        
        if(buttons.length === 0) {
            buttons.push(buildMenuButton(mainMenuX, mainMenuY, buttonHeight, buttonTitlePadding, GAME_SCALE));
        } 

        selectorPositionsIndex = 0;

        for(let person of credits) {
            person.contributions = person.contributions.split(', ');
        }
    };

    this.transitionOut = function() {
        canvas.width = 160;
        canvas.height = 144;
    };

    this.run = function(deltaTime) {
        update(deltaTime);

        draw();
    };

    this.control = function(newKeyEvent, pressed, pressedKeys) {
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (newKeyEvent) {
            case ALIAS.UP:
                timeMultiplier++;
                return true;
            case ALIAS.DOWN:
                timeMultiplier--;
                return true;
            case ALIAS.POINTER:
                checkButtons();
                return true;    
            case KEY_SPACE:
                timeMultiplier = 0;
                return true;
        }
        
        return false;
    };

    const update = function(deltaTime) {
        textYPos -= timeMultiplier * deltaTime * SCROLL_SPEED / 1000;
    };

    const checkButtons = function() {
        let wasClicked = false;
        for(let i = 0; i < buttons.length; i++) {
            wasClicked = buttons[i].respondIfClicked(mouseX * (640/160), mouseY * (576/144));
            if(wasClicked) {break;}
        }
    };

    const buildMenuButton = function(x, y, height, padding, scale) {
        const thisClick = function() {
            SceneState.setState(SCENE.TITLE);
        }

        return new UIButton("MAIN MENU", x, y, height, padding, thisClick, Color.Aqua, scale);
    };

    const printNavigation = function() {
        for(let button of buttons) {
            button.draw();
        }
	};

    const draw = function() {
		// render the menu background
        drawBG();
        
		drawTitle();

        // render menu
        printNavigation();

        drawCredits();
	};
	
	const drawBG = function() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, '#252525');
    };
    
    const drawTitle = function() {
        const titleWidth = fontRenderer.getWidthOfText("CREDITS", 1, FONT.Stroked);
        fontRenderer.drawString(canvasContext, Math.round(canvas.width / 2 - titleWidth / 2), 10, "CREDITS", FONT.Stroked, 1);
    };

    const drawCredits = function() {
        let drawOffset = 0;
        for(let person of credits) {
            const nameWidth = fontRenderer.getWidthOfText(person.name, 1, FONT.Stroked);
            if(textYPos + drawOffset > 25) {
                fontRenderer.drawString(canvasContext, Math.round(canvas.width / 2 - nameWidth / 2), textYPos + drawOffset, person.name, FONT.Stroked, 1);
            }
            drawOffset += Math.round(1.5 * fontRenderer.getHeightOfText(1, FONT.Stroked));
            for(let contribution of person.contributions) {
                if(textYPos + drawOffset > 25) {
                    const contributionWidth = fontRenderer.getWidthOfText(contribution, 1, FONT.White);
                    fontRenderer.drawString(canvasContext, Math.round(canvas.width / 2 - contributionWidth / 2), textYPos + drawOffset, contribution, FONT.White, 1);    
                }
                drawOffset += Math.round(1.5 * fontRenderer.getHeightOfText(1, FONT.White));
            }
            drawOffset += Math.round(1.5 * fontRenderer.getHeightOfText(1, FONT.Stroked));
        }
    };
}