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
    CrouchAttackLeft:'crouchAttackLeft',
    CrouchAttackRight:'crouchAttackRight',
    JumpAttackLeft:'JumpAttackLeft',
    JumpAttackRight:'JumpAttackRight',
    FallAttackLeft:'FallAttackLeft',
    FallAttackRight:'FallAttackRight',
	KnockBackLeft: 'knockbackLeft',
	KnockBackRight: 'knockbackRight',
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

    this.drawOffset = {x:0, y:0};

    const idleRightOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const idleLeftOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const walkRightOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const walkLeftOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];
    
    const crouchRightOffsets = [
        {x:size.width/2-6, y:size.height-20}, //top left corner
        {x:size.width/2+6, y:size.height-20}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const crouchLeftOffsets = [
        {x:size.width/2-6, y:size.height - 20}, //top left corner
        {x:size.width/2+6, y:size.height - 20}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const jumpRightOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const jumpLeftOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const fallingRightOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const fallingLeftOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height - 6}, //bottom right corner
        {x:size.width/2+6, y:size.height - 6} //bottom left corner
    ];

    const landingRightOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const landingLeftOffsets = [
        {x:size.width/2-6, y:size.height - 29}, //top left corner
        {x:size.width/2+6, y:size.height - 29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const attackRightOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const attackLeftOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const thumbOffsets = [
        {x:size.width/2-6, y:size.height-29}, //top left corner
        {x:size.width/2+6, y:size.height-29}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const knockbackRightOffsets = [
        {x:size.width/2-6, y:size.height-20}, //top left corner
        {x:size.width/2+6, y:size.height-20}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    const knockbackLeftOffsets = [
        {x:size.width/2-6, y:size.height - 20}, //top left corner
        {x:size.width/2+6, y:size.height - 20}, //top right corner
        {x:size.width/2-6, y:size.height}, //bottom right corner
        {x:size.width/2+6, y:size.height} //bottom left corner
    ];

    let currentOffsets = idleRightOffsets;

    this.updateCollider = function(x, y) {
        body.setPosition(//this is complicated because the player moves the camera/canvas
            x + (startX - canvas.center.x), 
            y + (startY - canvas.center.y)
        );

        return this.drawOffset;
    };

    this.processEnvironmentCollision = function(playerPos, playerVel, otherEntity, collisionData) {
		if((playerVel.x > 0) && (otherEntity.collisionBody.center.x > body.center.x)) {
            playerVel.x = 0;
        } if (playerVel.x < 0 && otherEntity.collisionBody.center.x - canvas.center.x < body.center.x) {
            playerVel.x = 0;
        }

        playerPos.y += Math.ceil(collisionData.magnitude * collisionData.y);
        if ((Math.abs(collisionData.y) > 0.01) && (playerVel.y > 0)) playerVel.y = 0;

        this.updateCollider(playerPos.x, playerPos.y);
    };

    this.setPointsForState = function(state, position) {
        let theseOffsets;
        this.drawOffset.x = 0;
        this.drawOffset.y = 0;
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
            case PlayerState.CrouchAttackLeft:
                theseOffsets = crouchLeftOffsets;
                this.drawOffset.y = -9;
                break;
            case PlayerState.CrouchRight:
            case PlayerState.CrouchAttackRight:
                this.drawOffset.y = -9;
                theseOffsets = crouchRightOffsets;
                break;
            case PlayerState.JumpLeft:
            case PlayerState.JumpAttackLeft:
                theseOffsets = jumpLeftOffsets;
                break;
            case PlayerState.JumpRight:
            case PlayerState.JumpAttackRight:
                theseOffsets = jumpRightOffsets;
                break;
            case PlayerState.FallingLeft:
            case PlayerState.FallAttackLeft:
                this.drawOffset.y = -6;
                theseOffsets = fallingLeftOffsets;
                break;
            case PlayerState.FallingRight:
            case PlayerState.FallAttackRight:
                this.drawOffset.y = -6;
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
            case PlayerState.Hurt:
            case PlayerState.Dead:
            case PlayerState.KnockBackLeft:
                this.drawOffset.y = -9;
                theseOffsets = knockbackLeftOffsets;
                break;
            case PlayerState.KnockBackRight:
                this.drawOffset.y = -9;
                theseOffsets = knockbackRightOffsets;
                break;
            }

        const newPoints = [];
        for(let i = 0; i < body.points.length; i++) {
            const point = body.points[i];
            point.x = position.x + (startX - canvas.center.x) + theseOffsets[i].x + 45;
            point.y = position.y + (startY - canvas.center.y) + theseOffsets[i].y;
            newPoints.push(point);
        }

        body.setPoints(newPoints);

        this.state = state;
    };
}
