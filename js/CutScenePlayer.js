//CutScenePlayer
function CutScenePlayer(posX, posY) {
    const WIDTH = 23;
	const ANIM_WIDTH = 32
    const HEIGHT = 33;
    const WALK_SPEED = 65;
    const CLIMB_SPEED = -30;
    const FRAME_WIDTH = 83; //old tile sheet = 24, then = 64, now 83
    const FRAME_HEIGHT = 36;
    const SIZE = {width:WIDTH, height:HEIGHT};

    let currentAnimation;
    this.position = {x:posX, y:posY};
    velocity = {x:WALK_SPEED, y:0};

    this.getSize = function() {
        return SIZE;
    };

    this.update = function(deltaTime) {
        currentAnimation.update(deltaTime);

        this.position.x += Math.round(velocity.x * deltaTime / 1000);
        this.position.y += Math.round(velocity.y * deltaTime / 1000);

        if(currentAnimation === animations.jumping) {
            velocity.y += GRAVITY * deltaTime / 1200;
            if (velocity.y > MAX_Y_SPEED) velocity.y = MAX_Y_SPEED;
        }
    };

    this.climb = function() {
        velocity.x = 0;
        velocity.y = CLIMB_SPEED;
        currentAnimation = animations.climbing;
    };

    this.walk = function() {
        velocity.x = WALK_SPEED;
        velocity.y = 0;
        currentAnimation = animations.walking;
    };

    this.idle = function() {
        velocity.x = 0;
        velocity.y = 0;
        currentAnimation = animations.idle;
    };

    this.jump = function() {
        velocity.x = WALK_SPEED;
        velocity.y = -MAX_Y_SPEED;
        currentAnimation = animations.jumping;
    }

    this.fall = function() {
        velocity.x = 0;
        velocity.y = WALK_SPEED;
        currentAnimation = animations.falling;
    };

    this.die = function() {
        velocity.x = 0;
        velocity.y = 0;
        currentAnimation = animations.dieing;
    }

    this.draw = function(deltaTime) {
        currentAnimation.drawAt(this.position.x, this.position.y);
    };

    const initializeAnimations = function() {
        const anims = {};

        anims.idle = new SpriteAnimation('idle', playerSpriteSheet, [0, 1, 2, 3], FRAME_WIDTH, FRAME_HEIGHT, [360], false, true, [8, 8, 8, 8]);
        anims.walking = new SpriteAnimation('walk', playerSpriteSheet, [4, 5, 6, 7], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true);
        anims.climbing = new SpriteAnimation('climb', playerSpriteSheet, [29, 30], FRAME_WIDTH, FRAME_HEIGHT, [164], false, true);
        anims.jumping = new SpriteAnimation('jump', playerSpriteSheet, [9], FRAME_WIDTH, FRAME_HEIGHT, [20], false, false, [0], playerBrightSheet);
        anims.falling = new SpriteAnimation('fall', playerSpriteSheet, [8], FRAME_WIDTH, FRAME_HEIGHT, [164], false, false, [0]);
        anims.dieing = new SpriteAnimation('death', playerSpriteSheet, [31, 32, 33], FRAME_WIDTH, FRAME_HEIGHT, [125, 125, 400], false, false, [0], playerBrightSheet);

        return anims;
    };
    const animations = initializeAnimations();
    currentAnimation = animations.walking;
}