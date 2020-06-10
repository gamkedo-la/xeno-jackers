//Animation
function SpriteAnimation(name, //string identifier for this animation
                   image, //image in which the frames reside
                   frames = [0], //array of frame indexes to use for this animation
                   frameWidth = 32, //width of each frame
                   frameHeight = 32, //height of each frame
                   frameTimes = [64],//array of milliseconds to show each frame
                   reverses = false, //boolean indicates if animation reverses (true)
                   loops = false, //boolean indicates if animation loops (true)
                   frameOffsetH = [0]) { //array of pixels to offset each frame (0)
                    
    this.name = name;
    this.scale = 1;
    let isFinished = false; //only becomes true if reverses is false and loops is false (i.e. does neither)
    this.getIsFinished = function() {
        return isFinished;
    };

    let times;
    let isInReverse = false;
    let currentFrameIndex = 0;
    const framesPerRow = Math.round(image.width / frameWidth);
    
    let remainderTime = 0;

    this.reset = function() {
        isFinished = false;
        isInReverse = false;
        currentFrameIndex = 0;
        remainderTime = 0;
    };

    this.getCurrentFrameIndex = function() {
        return currentFrameIndex;
    };
    
    this.update = function(deltaTime) {
        if(times == null) {return;}

        remainderTime += deltaTime;
        while(remainderTime >= times[currentFrameIndex]) {
            remainderTime -= times[currentFrameIndex];
            currentFrameIndex = nextFrameIndex(currentFrameIndex, frames);
        }
    }

    this.drawAt = function(x = 0, y = 0, flipped = false, offset = 0) {
        const thisFrameRect = getCurrentFrameRect();
		
        canvasContext.save();
		
		let drawPosX = x;
		let drawPosY = y;
		if(flipped) {
			canvasContext.translate(x + (this.scale * thisFrameRect.width), y);
			canvasContext.scale(-1, 1);
			drawPosX = 0;
			drawPosY = 0;
		}

        canvasContext.drawImage(image, 
            thisFrameRect.x + offset, thisFrameRect.y, thisFrameRect.width, thisFrameRect.height,
            drawPosX, drawPosY, thisFrameRect.width * this.scale, thisFrameRect.height * this.scale);

            canvasContext.restore();
    }

    const getCurrentFrameRect = function() {
        const nowFrameIndex = frames[currentFrameIndex];
        const xClipPos = frameWidth * (nowFrameIndex % framesPerRow);
        const yClipPos = frameHeight * (Math.floor(nowFrameIndex / framesPerRow));
        return {x:xClipPos, y:yClipPos, width:frameWidth, height:frameHeight};
    }

    const initializeFrameTimes = function(frameTimes, frames) {
        let newFrameTimes = [];
        if(frameTimes.length != frames.length) {
            for(let i = 0; i < frames.length; i++) {
                newFrameTimes.push(frameTimes[0]);
            }
        } else {
            newFrameTimes = frameTimes;
        }

        return newFrameTimes;
    }
    times = initializeFrameTimes(frameTimes, frames);//need to call this function now that it is defined

    const initializeFrameOffsetH = function(frameOffsetH, frames) {  //duplicated from FrameTimes const above.
        let newFrameOffsetH = [];
        if(frameOffsetH.length != frames.length) {
            for(let i = 0; i < frames.length; i++) {
                newFrameOffsetH.push(frameOffsetH[0]);
            }
        } else {
            newFrameOffsetH = frameOffsetH;
        }

        return newFrameOffsetH;
    }
    offsets = initializeFrameOffsetH(frameOffsetH, frames);//need to call this function now that it is defined

    const nextFrameIndex = function(currentFrame, frames) {
        let newFrameIndex;
        if(isInReverse) {
            newFrameIndex = currentFrame - 1;
            if(newFrameIndex < 0) {
                newFrameIndex = currentFrame + 1;
                isInReverse = false;
            } 
        } else {
            newFrameIndex = currentFrame + 1;
            if(newFrameIndex >= frames.length) {
                if(reverses) {
                    newFrameIndex = currentFrame - 1;
                    isInReverse = true;
                } else if(loops) {
                    newFrameIndex = 0;
                } else {
                    newFrameIndex = currentFrame;
                    isFinished = true;
                }
            }
        }

        return newFrameIndex;
    }
}