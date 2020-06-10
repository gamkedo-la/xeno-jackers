//Collider
const ColliderType = {
	Polygon:"polygon",
	Circle:"circle",
	AABB:"aabb"
};

function AABBCollider(points) {
	this.type = ColliderType.AABB;
    this.points = [...points];
    this.isOnScreen = true;
    this.radius = 1;
    this.center = {x:0, y:0};
    this.position = {x:0, y:0};

    this.top = {left:0, right:0, y:0, normal:{x:0, y:-1}};
    this.bottom = {left:0, right:0, y:0, normal:{x:0, y:1}};
    this.left = {top:0, bottom:0, x:0, normal:{x:-1, y:0}};
    this.right = {top:0, bottom:0, x:0, normal:{x:1, y:0}};

    this.width = 0;
    this.height = 0;

    this.findCenterAndRadiusOfPoints = function() {
		let minX = this.points[0].x;
		let maxX = this.points[0].x; 
		let minY = this.points[0].y; 
		let maxY = this.points[0].y;
		
		for(let i = 1; i < this.points.length; i++) {
			minX = Math.min(minX, this.points[i].x);
			maxX = Math.max(maxX, this.points[i].x);
			minY = Math.min(minY, this.points[i].y);
			maxY = Math.max(maxY, this.points[i].y);
		}
		
		const halfDeltaX = (maxX - minX) / 2;
		const centerX = minX + (halfDeltaX);
		const halfDeltaY = (maxY - minY) / 2;
        const centerY = minY + (halfDeltaY);
        
        this.width = maxX - minX;
        this.height = maxY - minY;
		
        this.center = {x: centerX, y: centerY};
        this.position.x = minX;
        this.position.y = minY;

        this.left.x = minX;
        this.left.top = minY;
        this.left.bottom = maxY;
        this.right.x = maxX;
        this.right.top = minY;
        this.right.bottom = maxY;
        this.top.y = minY;
        this.top.left = minX;
        this.top.right = maxX;
        this.bottom.y = maxY;
        this.bottom.left = minX;
        this.bottom.right = maxX;
		
		//Divide by 0.707 (cos(45)) to account for worst case distance from center to a corner => polygon radii are ~30% too big (which is fine)
		this.radius = Math.max(Math.abs(halfDeltaX / 0.707), Math.abs(halfDeltaY / 0.707));		
    };
    this.findCenterAndRadiusOfPoints();

    this.setPosition = function(newX, newY) {
        this.points[0].x = newX;
        this.points[0].y = newY;

        this.points[1].x = newX + this.width;
        this.points[1].y = newY;

        this.points[2].x = newX + this.width;
        this.points[2].y = newY + this.height;

        this.points[3].x = newX;
        this.points[3].y = newY + this.height;

        this.center.x = newX + this.width / 2;
        this.center.y = newY + this.height / 2;
		
		this.findCenterAndRadiusOfPoints();
    };
    
    this.calcOnscreen = function(canvas) {
		const left = 0;
		const right = canvas.width;
        const top = 0;
        const bottom = canvas.height;

        for(let point of this.points) {
            if(isPointOnScreen(left, top, right, bottom, point)) {
				this.isOnScreen = true;
				return true;
            }
		}
		
		for(let i = 0; i < this.points.length; i++) {
			//Large objects (like the ground) might cross the screen, but have no points onscreen
			//Look for pairs of points that cause lines to cross the screen
			const point1 = this.points[i];
			let point2;
			if(i === this.points.length - 1) {
				point2 = this.points[0];
			} else {
				point2 = this.points[i + 1];
			}
			if(lineIsOnScreen(left, top, right, bottom, point1, point2)) {
				this.isOnScreen = true;
				return true;
			}
		}

		this.isOnScreen = false;
		return false;
    };
    
    const isPointOnScreen = function(left, top, right, bottom, point) {
        if((point.x >= left) && 
            (point.x <= right) && 
            (point.y >= top) && 
            (point.y <= bottom)) {
            return true;
        }

        return false;
	};
	
	const lineIsOnScreen = function(left, top, right, bottom, point1, point2) {
		//check left edge of screen
		if(lineVLineCollision(point1.x, point1.y, point2.x, point2.y, left, top, left, bottom)) {
			return true;
		//check bottom of screen
		} else if(lineVLineCollision(point1.x, point1.y, point2.x, point2.y, left, bottom, right, bottom)) {
			return true;
		//check right edge of screen
		} else if(lineVLineCollision(point1.x, point1.y, point2.x, point2.y, right, top, right, bottom)) {
			return true;
		//check top of screen
		} else if(lineVLineCollision(point1.x, point1.y, point2.x, point2.y, left, top, right, top)) {
			return true;
		}

		return false;
    };
    
    this.draw = function() {
		if(DRAW_COLLIDERS) {
			canvasContext.beginPath();
            canvasContext.strokeStyle = COLLIDER_COLOR;
            canvasContext.moveTo(this.points[0].x, this.points[0].y);
            for(let i = 0; i < this.points.length; i++) {
                canvasContext.lineTo(this.points[i].x, this.points[i].y);
            }
            
            canvasContext.lineTo(this.points[0].x, this.points[0].y);
            canvasContext.stroke();
            canvasContext.lineWidth = 1;
        }
    }
};

//Collision Manager
function CollisionManager(player) {
	let enemies = new Set();
	let enemyWeapons = new Set();
	let environment = new Set();
	let gameObjects = new Set();
    let playerTools = new Set();
	let playerList = [player];

    this.player = player;

	this.setPlayer = function(newPlayer) {
        this.player = newPlayer;
        playerList = [newPlayer];
		return true;
	};

	this.drawEnvironmentColliders = function() {
		//This is a hack for debugging -- akkk!!!
		for(let env of environment) {
			env.collisionBody.draw();
		}
	};

	this.addEntity = function(newEntity) {
        if (!newEntity) {
            console.log("Attempting to add an undefined entity!");
            return;
        }
        if(isEnemy(newEntity)) {
            return addEnemy(newEntity);
        } else if(isEnemyWeapon(newEntity)) {
			return addEnemyWeapon(newEntity);
		} else if(isEnvironment(newEntity)) {
			return addEnvironment(newEntity);
		} else if(isPlayerTool(newEntity)) {
			return addPlayerTool(newEntity);
        } else if(isPickup(newEntity)) {
			return addGameObject(newEntity);
		}
    };
    
    const addEnemy = function(newEnemy) {
        const beforeLength = enemies.size;
		enemies.add(newEnemy);

		return (!(beforeLength === enemies.size));
    };

	const addEnemyWeapon = function(newEnemyWeapon) {
		const beforeLength = enemyWeapons.size;
		enemyWeapons.add(newEnemyWeapon);

		return (!(beforeLength === enemyWeapons.size));
	};

	const addEnvironment = function(newEnvironment) {
		const beforeLength = environment.size;
		environment.add(newEnvironment);

		return (!(beforeLength === environment.size));
    };
    
    const addPlayerTool = function(newTool) {
        const beforeLength = playerTools.size;
		playerTools.add(newTool);

		return (!(beforeLength === playerTools.size));
	};
	
	const addGameObject = function(newObject) {
        const beforeLength = gameObjects.size;
		gameObjects.add(newObject);

		return (!(beforeLength === gameObjects.size));
    };
	
	this.removeEntity = function(entityToRemove) {
        if(isEnemy(entityToRemove)) {
            removeEnemy(entityToRemove);
        } else if(isEnemyWeapon(entityToRemove)) {
			removeEnemyWeapon(entityToRemove);
		} else if(isEnvironment(entityToRemove)) {
			removeEnvironment(entityToRemove);
        } else if(isPlayerTool(entityToRemove)) {
            removePlayerWeapon(entityToRemove);
        } else if(isPickup(entityToRemove)) {
			removeGameObject(entityToRemove);
		}
        
		if(enemies.has(entityToRemove)) {
			enemies.delete(entityToRemove);

			return true;
		}

		return false;
    };
    
    const removeEnemy = function(enemyToRemove) {
        if(enemies.has(enemyToRemove)) {
			enemies.delete(enemyToRemove);
			return true;
		}

		return false;
    };

	const removeEnemyWeapon = function(enemyWeaponToRemove) {
		if(enemyWeapons.has(enemyWeaponToRemove)) {
			enemyWeapons.delete(enemyWeaponToRemove);
			return true;
		}

		return false;
	};

	const removeEnvironment = function(environmentToRemove) {
		if(environment.has(environmentToRemove)) {
			environment.delete(environmentToRemove);

			return true;
		}

		return false;
    };
    
    const removePlayerWeapon = function(weaponToRemove) {
        if(playerTools.has(weaponToRemove)) {
			playerTools.delete(weaponToRemove);

			return true;
		}

		return false;
	};
	
	const removeGameObject = function(objectToRemove) {
        if(gameObjects.has(objectToRemove)) {
			gameObjects.delete(objectToRemove);
			return true;
		}

		return false;
    };

	this.clearWorldAndBullets = function() {
		enemies.clear();
		enemyWeapons.clear();
		environment.clear();
		gameObjects.clear();
//        playerTools.clear();//do we want this?
	};
    
	this.doCollisionChecks = function() {
        //Player vs Enemies
        checkCollsionsForLists(playerList, enemies);

        //Player vs Enemy Weapons
        checkCollsionsForLists(playerList, enemyWeapons);

        //Player vs Environment
        checkCollsionsForLists(playerList, environment);

		//Player vs Other Game Objects
        checkCollsionsForLists(playerList, gameObjects);

        //Player Weapons vs Enemies
        checkCollsionsForLists(enemies, playerTools);

        //Player Weapons vs Enemy Weapons
        checkCollsionsForLists(enemyWeapons, playerTools);

        //Player Weapons vs Environment
        checkCollsionsForLists(environment, playerTools);

        //Enemy Weapons vs Environment
        checkCollsionsForLists(enemyWeapons, environment);

        //Enemies vs Environment
		checkCollsionsForLists(enemies, environment);

        //Other Game Objects vs Environment
		checkCollsionsForLists(gameObjects, environment);
	};

    const checkCollsionsForLists = function(list1, list2) {
        for(let entity1 of list1) {
            if(!entity1.collisionBody.isOnScreen) {
				continue;//not on screen so bail early
			} 
			for(let entity2 of list2) {
                if(!entity2.collisionBody.isOnScreen) {
					continue;//not on screen so bail early
				}
                actualCollisionCheck(entity1, entity2);
			}
        }
    };

    const actualCollisionCheck = function(entity1, entity2) {
        if(withinSquareRadii(entity1.collisionBody, entity2.collisionBody)) {
            //if both objects are circles, the above check is a valid collision
            if((entity1.collisionBody.type === ColliderType.Circle) &&
               (entity2.collisionBody.type === ColliderType.Circle)) {
                entity1.didCollideWith(entity2);
                entity2.didCollideWith(entity1);
                return;
            }

			collisionResults = checkAABBCollisionBetween(entity1.collisionBody, entity2.collisionBody);
			if(collisionResults.collision) {
				entity1.didCollideWith(entity2, collisionResults.body1);
				entity2.didCollideWith(entity1, collisionResults.body2);
			}
        }
    };
    
	const withinSquareRadii = function(body1, body2) {
		const squareDist = (body1.center.x - body2.center.x) * (body1.center.x - body2.center.x) +
						   (body1.center.y - body2.center.y) * (body1.center.y - body2.center.y);
		const squareRadius = (body1.radius + body2.radius) * (body1.radius + body2.radius);

		return (squareDist <= squareRadius);
	};

	const checkAABBCollisionBetween = function(body1, body2) {
		const result = {collision:false, body1:{deltaX:0, deltaY:0}, body2:{deltaX:0, deltaY:0}};
		
        const body1Right_vs_body2Top = lineVLineCollision(
            body1.right.x, body1.right.top,
            body1.right.x, body1.right.bottom,
            body2.top.left, body2.top.y,
            body2.top.right, body2.top.y
        );

        const body1Left_vs_body2Top = lineVLineCollision(
            body1.left.x, body1.left.top,
            body1.left.x, body1.left.bottom,
            body2.top.left, body2.top.y,
            body2.top.right, body2.top.y
        );

        const body1Right_vs_body2Bottom = lineVLineCollision(
            body1.right.x, body1.right.top,
            body1.right.x, body1.right.bottom,
            body2.bottom.left, body2.bottom.y,
            body2.bottom.right, body2.bottom.y
        );

        const body1Left_vs_body2Bottom = lineVLineCollision(
            body1.left.x, body1.left.top,
            body1.left.x, body1.left.bottom,
            body2.bottom.left, body2.bottom.y,
            body2.bottom.right, body2.bottom.y
		);
		
		const body1Top_vs_body2Left = lineVLineCollision(
			body1.top.left, body1.top.y,
			body1.top.right, body1.top.y,
			body2.left.x, body2.left.top,
			body2.left.x, body2.left.bottom
		);

		const body1Top_vs_body2Right = lineVLineCollision(
			body1.top.left, body1.top.y,
			body1.top.right, body1.top.y,
			body2.right.x, body2.right.top,
			body2.right.x, body2.right.bottom
		);

		const body1Bottom_vs_body2Left = lineVLineCollision(
			body1.bottom.left, body1.bottom.y,
			body1.bottom.right, body1.bottom.y,
			body2.left.x, body2.left.top,
			body2.left.x, body2.left.bottom
		);
	
		const body1Bottom_vs_body2Right = lineVLineCollision(
			body1.bottom.left, body1.bottom.y,
			body1.bottom.right, body1.bottom.y,
			body2.right.x, body2.right.top,
			body2.right.x, body2.right.bottom
		);

		if(body1Left_vs_body2Top && body1Right_vs_body2Top) {
			//collision is all along the bottom of body1
			result.collision = true;
			result.body1.deltaX = Number.MAX_SAFE_INTEGER;
			result.body1.deltaY = Math.round(body2.top.y - body1.right.bottom);
		} else if(body1Left_vs_body2Bottom && body1Right_vs_body2Bottom) {
			//collision is all along the top of body1
			result.collision = true;
			result.body1.deltaX = Number.MAX_SAFE_INTEGER;
			result.body1.deltaY = Math.round(body2.bottom.y - body1.right.top);
		} else if((body1Top_vs_body2Left) && (body1Top_vs_body2Right)) {
			//collision is all along the bottom of body2 (i.e. only in the top of body1)
			result.collision = true;
			result.body1.deltaX = Number.MAX_SAFE_INTEGER;
			result.body1.deltaY = Math.round(body2.bottom.y - body1.right.top);
		} else if((body1Bottom_vs_body2Left) && (body1Bottom_vs_body2Right)) {
			//collision is all along the top of body2 (i.e. only in the bottom of body1)
			result.collision = true;
			result.body1.deltaX = Number.MAX_SAFE_INTEGER;
			result.body1.deltaY = Math.round(body2.top.y - body1.right.bottom);
		} else if((body1Right_vs_body2Top) && (body1Right_vs_body2Bottom)) {
			//collision is all along the left side of body2 (i.e. only in body1's right side)
			result.collision = true;
			result.body1.deltaX = Math.round(body2.top.left - body1.right.x);
			result.body1.deltaY = Number.MAX_SAFE_INTEGER;
		} else if((body1Left_vs_body2Top) && (body1Left_vs_body2Bottom)) {
			//collision is all along the right side of body2 (i.e. only in body1's left side)
			result.collision = true;
			result.body1.deltaX = Math.round(body2.top.right - body1.left.x);
			result.body1.deltaY = Number.MAX_SAFE_INTEGER;
		} else if((body1Top_vs_body2Left) && (body1Bottom_vs_body2Left)) {
			//collision is all along body1's right side
			result.collision = true;
			result.body1.deltaX = Math.round(body2.left.x - body1.top.right);
			result.body1.deltaY = Number.MAX_SAFE_INTEGER;
		} else if((body1Top_vs_body2Right) && (body1Bottom_vs_body2Right)) {
			//collision is all along body1's left side
			result.collision = true;
			result.body1.deltaX = Math.round(body2.right.x - body1.type.left);
			result.body1.deltaY = Number.MAX_SAFE_INTEGER;
		} else if(body1Right_vs_body2Top) {
            //collision point is at body1Right at the bottom: {x:body1.right.x, y:body1.right.bottom}
            //collision point is at body2Top at the left: {x:body2.top.left, y:body2.top.y}
            result.collision = true;
            result.body1.deltaX = Math.round(body2.top.left - body1.right.x);
            result.body1.deltaY = Math.round(body2.top.y - body1.right.bottom);
        } else if(body1Left_vs_body2Top) {
            //collision point is at body1Left at the bottom: {x:body1.left.x, y:body1.left.bottom}
            //collision point is at body2Top at the right: {x:body2.top.right, y:body2.top.y}
            result.collision = true;
            result.body1.deltaX = Math.round(body2.top.right - body1.left.x);
            result.body1.deltaY = Math.round(body2.top.y - body1.left.bottom);
        } else if(body1Right_vs_body2Bottom) {
            //collision point is at body1Right at the top: {x:body1.right.x, y:body1.right.top}
            //collision point is at body2Bottom at the left: {x:body2.bottom.left, y:body2.bottom.y}
            result.collision = true;
            result.body1.deltaX = Math.round(body2.bottom.left - body1.right.x);
            result.body1.deltaY = Math.round(body2.bottom.y - body1.right.top);
        } else if(body1Left_vs_body2Bottom) {
            //collision point is at body1Left at the top: {x:body1.left.x, y:body1.left.top}
            //collision point is at body2Bottom at the right: {x:body2.bottom.right, y:body2.bottom.y}
            result.collision = true;
            result.body1.deltaX = Math.round(body2.bottom.right - body1.left.x);
            result.body1.deltaY = Math.round(body2.bottom.y - body1.left.top);
        } 

        //directions are opposite for body2
        result.body2.deltaX = -result.body1.deltaX;
		result.body2.deltaY = -result.body1.deltaY;
		
        return result;
	};
}

function magnitudeOfVec(vector) {
	return Math.sqrt(((vector.x * vector.x) + (vector.y * vector.y)));
}

function dotProduct(vec1, vec2) {
	return (vec1.x * vec2.x) + (vec1.y * vec2.y);
}

function normalize(vector) {
	const magnitude = magnitudeOfVec(vector);
	return {x:vector.x / magnitude, y:vector.y / magnitude};
}

function lineVLineCollision(line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2) {
	const denominator = ((line1x2 - line1x1) * (line2y2 - line2y1)) - ((line1y2 - line1y1) * (line2x2 - line2x1));
	const numerator1 = ((line1y1 - line2y1) * (line2x2 - line2x1)) - ((line1x1 - line2x1) * (line2y2 - line2y1));
	const numerator2 = ((line1y1 - line2y1) * (line1x2 - line1x1)) - ((line1x1 - line2x1) * (line1y2 - line1y1));

	if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

	const r = numerator1 / denominator;
	const s = numerator2 / denominator;

	return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
};
