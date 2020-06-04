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
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const idleLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const walkRightOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const walkLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];
    
    const crouchRightOffsets = [
        {x:25, y:10},
        {x:38, y:10},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const crouchLeftOffsets = [
        {x:25, y:10},
        {x:38, y:10},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const jumpRightOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height - 6},
        {x:25, y:size.height - 6}
    ];

    const jumpLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height - 6},
        {x:25, y:size.height - 6}
    ];

    const fallingRightOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height - 6},
        {x:25, y:size.height - 6}
    ];

    const fallingLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height - 6},
        {x:25, y:size.height - 6}
    ];

    const landingRightOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const landingLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const attackRightOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const attackLeftOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    const thumbOffsets = [
        {x:25, y:6},
        {x:38, y:6},
        {x:38, y:size.height},
        {x:25, y:size.height}
    ];

    let currentOffsets = idleRightOffsets;

    this.updateCollider = function(x, y) {
        body.setPosition(//this is complicated because the player moves the camera/canvas
            x + (startX - canvas.center.x), 
            y + (startY - canvas.center.y)
        );
    };

    this.processEnvironmentCollision = function(playerPos, playerVel, otherEntity, collisionData) {
        if((playerVel.x > 0) && (otherEntity.collisionBody.center.x > body.center.x)) {
            playerVel.x = 0;
        }
        if(playerVel.x < 0) {
            if(otherEntity.collisionBody.center.x - canvas.center.x < body.center.x) {
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
