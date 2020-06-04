//Player State
const PlayerState = {
    IdleLeft:'idleLeft',
    IdleRight:'idleRight',
    WalkLeft:'walkLeft',
    WalkRight:'walkRight',
    CrouchLeft:'crouchLeft',
    CrouchRight:'crouchRight',
    JumpLeft:'jumpLeft',
    JumpRight:'jumpRight',
    FallingLeft:'fallingLeft',
    FallingRight:'fallingRight',
    LandingLeft:'landingLeft',
    LandingRight:'landingRight',
    AttackLeft:'attackLeft',
    AttackRight:'attackRight',
	KnockBack: 'knockback',
	Hurt: 'gettingHurt',
	Dead: 'dead',
    Thumb:'thumb'
}

//PlayerColliderManager.js
function PlayerColliderManager(startX, startY, size) {
    let body;

    this.state = null;

    this.setBody = function(newBody) {
        body = newBody
    };

    const idleRightOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const idleLeftOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const walkRightOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const walkLeftOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];
    
    const crouchRightOffsets = [
        {x:size.width/2+6, y:size.height-20}, //top right corner
        {x:size.width/2-6, y:size.height-20}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const crouchLeftOffsets = [
        {x:size.width/2+6, y:size.height - 20}, //top right corner
        {x:size.width/2-6, y:size.height - 20}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const jumpRightOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const jumpLeftOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const fallingRightOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const fallingLeftOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const landingRightOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const landingLeftOffsets = [
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const attackRightOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const attackLeftOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const thumbOffsets = [
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    let currentOffsets = idleRightOffsets;

    this.updateCollider = function(x, y) {
        body.setPosition(//this is complicated because the player moves the camera/canvas
            x + (startX - canvas.center.x), 
            y + (startY - canvas.center.y)
        );
    };

    this.processEnvironmentCollision = function(playerPos, playerVel, otherEntity, collisionData) {
		if (otherEntity.type != 'ground') {
			if((playerVel.x > 0) && (otherEntity.collisionBody.center.x > body.center.x)) {
				playerVel.x = 0;
			} if (playerVel.x < 0 && otherEntity.collisionBody.center.x - canvas.center.x < body.center.x) {
				playerVel.x = 0;
			}
		}

//        if (Math.abs(collisionData.x) > 0.01) playerVel.x = 0;
        playerPos.y += Math.ceil(collisionData.magnitude * collisionData.y);
        if ((Math.abs(collisionData.y) > 0.01) && (playerVel.y > 0)) playerVel.y = 0;

        this.updateCollider(playerPos.x, playerPos.y);
    };

    this.setPointsForState = function(state, position) {
        let theseOffsets;
        switch(state) {
            case PlayerState.IdleLeft:
                theseOffsets = idleLeftOffsets;
                break;
            case PlayerState.IdleRight:
                theseOffsets = idleRightOffsets;
                break;
            case PlayerState.WalkLeft:
                theseOffsets = walkLeftOffsets;
                break;
            case PlayerState.WalkRight:
                theseOffsets = walkRightOffsets;
                break;
            case PlayerState.CrouchLeft:
                theseOffsets = crouchLeftOffsets;
                break;
            case PlayerState.CrouchRight:
                theseOffsets = crouchRightOffsets;
                break;
            case PlayerState.JumpLeft:
                theseOffsets = jumpLeftOffsets;
                break;
            case PlayerState.JumpRight:
                theseOffsets = jumpRightOffsets;
                break;
            case PlayerState.FallingLeft:
                theseOffsets = fallingLeftOffsets;
                break;
            case PlayerState.FallingRight:
                theseOffsets = fallingRightOffsets;
                break;
            case PlayerState.LandingLeft:
                theseOffsets = landingLeftOffsets;
                break;
            case PlayerState.LandingRight:
                theseOffsets = landingRightOffsets;
                break;
            case PlayerState.AttackLeft:
                theseOffsets = attackLeftOffsets;
                break;
            case PlayerState.AttackRight:
                theseOffsets = attackRightOffsets;
                break;
            case PlayerState.Thumb:
                theseOffsets = thumbOffsets;
                break;
            }

        for(let i = 0; i < body.points.length; i++) {
            const point = body.points[i];
            point.x = position.x + (startX - canvas.center.x) + theseOffsets[i].x;
            point.y = position.y + (startY - canvas.center.y) + theseOffsets[i].y;
        }

        this.state = state;
    };
}
