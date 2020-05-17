//UIButton
function UIButton(title, x, y, height, padding = 2, onClick, BGColor = Color.Aqua, scale = GAME_SCALE) {
    const bounds = {};
    this.title = title;
    
    this.onClick = onClick;

    const setBounds = function(title, x, y, height, padding) {
        bounds.width = fontRenderer.getWidthOfText(title, scale, FONT.White) + padding * 2;
        bounds.height = height;
        
        bounds.x = x;// - (bounds.width/2);
        bounds.y = y;// - (height * fontOverhangRatio) + height;
    }

    setBounds(this.title, x, y, height, padding);

    this.getBounds = function() {
        return bounds;
    }

    this.updateXPosition = function(newX) {
        bounds.x = newX;
    }

    this.updateYPosition = function(newY) {
        bounds.y = newY;
    }

    const didHit = function(pointerX, pointerY) {
        if(pointInside(pointerX, pointerY, bounds.x, bounds.y, bounds.width, bounds.height)) {
            return true;
        } else {
            return false;
        }
    }

    this.respondIfClicked = function(pointerX, pointerY) {
        if(didHit(pointerX, pointerY)) {
            this.onClick();
            return true;
        } else {
            return false;
        }
    }

    this.draw = function() {
        fontRenderer.drawString(canvasContext, x, y, title, FONT.White, scale);
        
        if(DEBUG) { // draw bounds for buttons in semi-transparent colors            
            const tempAlpha = canvasContext.globalAlpha;
            canvasContext.globalAlpha = 0.2;
            
            drawRect(bounds.x, bounds.y, bounds.width, bounds.height, BGColor);
            
            canvasContext.globalAlpha = tempAlpha;
        }
    }
}