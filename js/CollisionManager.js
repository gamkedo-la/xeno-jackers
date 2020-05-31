//Collider
const ColliderType = {
	Polygon:"polygon",
	Circle:"circle"
};

function Collider(type, points = [], position = {x:0, y:0}, center = {x:0, y:0}, radius = 1) {
	this.type = type;
	this.center = center;
	this.radius = radius;
	this.points = [...points];
	this.isOnScreen = true;

	this.normals = [];
	this.position = position;
	
	this.findCenterAndRadiusOfPoints = function(points) {
		let minX = points[0].x;
		let maxX = points[0].x; 
		let minY = points[0].y; 
		let maxY = points[0].y;
		
		for(let i = 1; i < points.length; i++) {
			minX = Math.min(minX, points[i].x);
			maxX = Math.max(maxX, points[i].x);
			minY = Math.min(minY, points[i].y);
			maxY = Math.max(maxY, points[i].y);
		}
		
		const halfDeltaX = (maxX - minX) / 2;
		const centerX = minX + (halfDeltaX);
		const halfDeltaY = (maxY - minY) / 2;
		const centerY = minY + (halfDeltaY);
		
		this.center = {x: centerX, y: centerY};
		
		//Divide by 0.707 (cos(45)) to account for worst case distance from center to a corner => polygon radii are ~30% too big (which is fine)
		this.radius = Math.max(Math.abs(halfDeltaX / 0.707), Math.abs(halfDeltaY / 0.707));		
	};

	this.setPoints = function(newPoints) {
		this.points = newPoints;
		this.calculateNormals();
	}

	this.calculateNormals = function() {
		for(let i = 0; i < this.points.length; i++) {
			const start = this.points[i];
			let end;
			if(i === this.points.length - 1) {
				end = this.points[0];
			} else {
				end = this.points[i + 1];
			}

			const vector1 = {x:end.x - start.x, y:end.y - start.y};
			const magnitude = magnitudeOfVec(vector1);
			//perpendicular is either {-y, x} or {y, -x}
			//we assume clockwise winding, so always use {y, -x}
			this.normals.push({x: vector1.y / magnitude, y: -vector1.x / magnitude});
		}
	};
		
	if(this.type === ColliderType.Polygon) {
		this.points = points;
		this.findCenterAndRadiusOfPoints(this.points);
		this.calculateNormals();
	} else if(this.type === ColliderType.Circle) {
		this.center = center;
		this.radius = radius;
		this.points = null;
	}
	
	this.setPosition = function(newX, newY) {
		const deltaX = newX - this.position.x;
		const deltaY = newY - this.position.y;

		if(this.type === ColliderType.Polygon) {
			for(let i = 0; i < this.points.length; i++) {
				this.points[i].x += deltaX;
				this.points[i].y += deltaY;
			}
		}
		
		this.center.x += deltaX;
		this.center.y += deltaY;
		
		this.position.x = newX;
		this.position.y = newY;
	};
    
    this.calcOnscreen = function(canvas) {
		const left = 0;
		const right = canvas.width;
        const top = 0;
        const bottom = canvas.height;

        if(this.type === ColliderType.Circle) {
            this.isOnScreen = isCircleOnScreen(left, top, right, bottom, this.position);
        } else {
            this.isOnScreen = isPolygonOnScreen(left, top, right, bottom, this.points);
        }
	};
	
	this.draw = function() {
		if(DRAW_COLLIDERS) {
			switch(this.type) {
				case ColliderType.Polygon:
					canvasContext.beginPath();
					canvasContext.strokeStyle = COLLIDER_COLOR;
					canvasContext.moveTo(this.points[0].x, this.points[0].y);
					for(let i = 0; i < this.points.length; i++) {
						canvasContext.lineTo(this.points[i].x, this.points[i].y);
					}
					canvasContext.lineTo(this.points[0].x, this.points[0].y);
					canvasContext.stroke();
					break;
				case ColliderType.Circle:
					canvasContext.beginPath();
					canvasContext.strokeStyle = COLLIDER_COLOR;
					canvasContext.lineWidth = 2;
					canvasContext.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
					canvasContext.stroke();
					break;
			}
		}
	};
	
	this.getNormalForClosestEdge = function(otherBody) {
		if(otherBody.type === ColliderType.Circle) {
			return {x:this.center.x - otherBody.center.x, y:this.center.y - otherBody.center.y};
		} else {

		}
	};
    
    const isCircleOnScreen = function(left, top, right, bottom, position) {
        if((position.x > left - this.radius) &&
            (position.x < right + this.radius) &&
            (position.y > top - this.radius) &&
            (position.y < bottom + this.radius)) {
                return true;
            } 
            
            return false;
    };

    const isPolygonOnScreen = function(left, top, right, bottom, points) {
        for(let point of points) {
            if(isPointOnScreen(left, top, right, bottom, point)) {
                return true;
            }
		}
		
		for(let i = 0; i < points.length; i++) {
			//Large objects (like the ground) might cross the screen, but have no points onscreen
			//Look for pairs of points that cause lines to cross the screen
			const point1 = points[i];
			let point2;
			if(i === points.length - 1) {
				point2 = points[0];
			} else {
				point2 = points[i + 1];
			}
			if(lineIsOnScreen(left, top, right, bottom, point1, point2)) {
				return true;
			}
		}

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

	const lineVLineCollision = function(line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2) {
		const denominator = ((line1x2 - line1x1) * (line2y2 - line2y1)) - ((line1y2 - line1y1) * (line2x2 - line2x1));
		const numerator1 = ((line1y1 - line2y1) * (line2x2 - line2x1)) - ((line1x1 - line2x1) * (line2y2 - line2y1));
		const numerator2 = ((line1y1 - line2y1) * (line1x2 - line1x1)) - ((line1x1 - line2x1) * (line1y2 - line1y1));
	
		if (denominator == 0) return numerator1 == 0 && numerator2 == 0;
	
		const r = numerator1 / denominator;
		const s = numerator2 / denominator;
	
		return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
	};
}

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
        if(isEnemy(newEntity)) {
            return addEnemy(newEntity);
        } else if(isEnemyWeapon(newEntity)) {
			return addEnemyWeapon(newEntity);
		} else if(isEnvironment(newEntity)) {
			return addEnvironment(newEntity);
		} else if(isPlayerTool(newEntity)) {
			return  addPlayerWeapon(newEntity);
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
		playerTools.add(newWeapon);

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
        checkCollsionsForLists(playerTools, enemies);

        //Player Weapons vs Enemy Weapons
        checkCollsionsForLists(playerTools, enemyWeapons);

        //Player Weapons vs Environment
        checkCollsionsForLists(playerTools, environment);

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

			const collisionResults = checkCollisionBetween(entity1.collisionBody, entity2.collisionBody);
			if(collisionResults.magnitude > 0) {
				if(collisionResults.isBody1Normal) {
					entity2.didCollideWith(entity1, collisionResults);	
					//reverse direction so entity1 moves toward itself (opposite it's normal)
					collisionResults.x = -collisionResults.x;
					collisionResults.y = -collisionResults.y;
					entity1.didCollideWith(entity2, collisionResults);
				} else {
					entity1.didCollideWith(entity2, collisionResults);
					//reverse direction so entity2 moves toward itself (opposite it's normal)
					collisionResults.x = -collisionResults.x;
					collisionResults.y = -collisionResults.y;
					entity2.didCollideWith(entity1, collisionResults);	
				}
            }
        }
    };
    
	const withinSquareRadii = function(body1, body2) {
		const squareDist = (body1.center.x - body2.center.x) * (body1.center.x - body2.center.x) +
						   (body1.center.y - body2.center.y) * (body1.center.y - body2.center.y);
		const squareRadius = (body1.radius + body2.radius) * (body1.radius + body2.radius);

		return (squareDist <= squareRadius);
	};

	const checkCollisionBetween = function(body1, body2) {
		if(body1.type === ColliderType.Polygon) {
			if(body2.type === ColliderType.Polygon) {
				return getMagnitudeAndDirectionOfOverlap(body1, body2);
			} else if(body2.type === ColliderType.Circle) {
				return polygonVCircle(body1, body2);
			}
		} else if(body1.type === ColliderType.Circle) {
			if(body2.type === ColliderType.Polygon) {
				return polygonVCircle(body2, body1);//reverse the order so polygon passed as first parameter
			}
		}
	};

	const polygonVCircle = function(polygon, circle) {
		for(let i = 0; i < polygon.points.length; i++) {//loop through each side of the polygon to check for a circle-line collision on each
			const start = polygon.points[i];//start point of this edge
			let end;
			if(i < polygon.points.length - 1) {//end point of this edge, loop back to beginning
				end = polygon.points[i + 1];
			} else {
				end = polygon.points[0];
			}

			const side = {x:end.x - start.x, y:end.y - start.y};
			const circleToStart = {x:circle.center.x - start.x, y:circle.center.y - start.y};//line from circle center to start point of polygon side
			const magnitudeOfSide = magnitudeOfVec(side);

			//how much of the circle-start vector is in line with this polygon side?
			const scalarProjection = dotProduct(circleToStart, side) / (magnitudeOfSide * magnitudeOfSide);

			//if between 0 and 1, the circle center is between this side's start and end points
			//add/subtract circleRadius/magnitude of side to account for collisions on the end points of the polygon side
			if((scalarProjection >= -(circle.radius / magnitudeOfSide)) && (scalarProjection <= (1 + circle.radius / magnitudeOfSide))) {
				const vectorProjection = {x:scalarProjection * side.x, y:scalarProjection * side.y};

				//Rejection vector is that portion of circle-start vector which is perpendicular to the polygon side
				const vectorRejection = {x:circleToStart.x - vectorProjection.x, y:circleToStart.y - vectorProjection.y};
				const magnitudeRejection = magnitudeOfVec(vectorRejection);

				//if the magnitude of the rejection vector is less than the circle radius, there is a collision
				if(magnitudeRejection <= circle.radius) {
					return {magnitude:circle.radius - magnitudeRejection,
							x: polygon.normals[i].x,
							y: polygon.normals[i].y,
							isBody1Normal:true
						};
				}
			}
		}
		return {magnitude:0,
				x: 0,
				y: 0,
				isBody1Normal:false
		};
	};

	const checkedNormals = new Set();
	const getMagnitudeAndDirectionOfOverlap = function(body1, body2) {
		checkedNormals.clear();
		let result = {magnitude:0, x:0, y:0, isBody1Normal:false, body1Index:0, body2Index:0};
		let leftOverlap = 0;
		
		for(let normal of body1.normals) {
			checkedNormals.add(normal.x);//add it to the set so we don't check it again
			const body1MinMax = getMinMax(body1, normal);
			const body2MinMax = getMinMax(body2, normal);

			result = getOverlapData(body1MinMax, body2MinMax, normal, result, true);
			if(normal.x < -0.9) {
				leftOverlap = result.magnitude;
			}
			if(result.magnitude === 0) return result;
		}

		for(let normal of body2.normals) {
			checkedNormals.add(normal.x);//add it to the set so we don't check it again
			const body1MinMax = getMinMax(body1, normal);
			const body2MinMax = getMinMax(body2, normal);

			result = getOverlapData(body1MinMax, body2MinMax, normal, result, false);
			if(result.magnitude === 0) return result;
		}

 		//check if the normal points the wrong way and reverse it if it does
		const center1ToCenter2 = {x:body2.center.x - body1.center.x, y:body2.center.y - body1.center.y};
		if(result.isBody1Normal) {
			if(dotProduct(center1ToCenter2, {x:result.x, y:result.y}) < 0) {
				result.y = -result.y;
			}
		} else {
			if(dotProduct(center1ToCenter2, {x:result.x, y:result.y}) > 0) {
				result.y = -result.y;
			}
		}

		result.x = (Math.round(result.x * 100)) / 100;
		result.y = (Math.round(result.y * 100)) / 100;

		return result;
	};

	const getOverlapData = function(body1MinMax, body2MinMax, normal, result, isBody1Normal) {
		if(body1MinMax.centerValue <= body2MinMax.centerValue) {
			if(body1MinMax.maxValue <= body2MinMax.minValue) {
				//no collision
				result.magnitude = 0;
				result.x = 0;
				result.y = 0;
				result.isBody1Normal = false;
				return result;
			} else {
				//there may be a collision
				const overlap = Math.round(body1MinMax.maxValue - Math.max(body1MinMax.minValue, body2MinMax.minValue));
				if(result.magnitude === 0) {
					result.magnitude = overlap;
					result.x = normal.x;
					result.y = normal.y;
					result.isBody1Normal = isBody1Normal;
					result.body1Index = body1MinMax.maxIndex;
					result.body2Index = body2MinMax.minIndex;
				} else if(overlap <= result.magnitude) {
					result.magnitude = overlap;
					result.x = normal.x;
					result.y = normal.y;
					result.isBody1Normal = isBody1Normal;
					result.body1Index = body1MinMax.maxIndex;
					result.body2Index = body2MinMax.minIndex;
				}
			}
		} else {
			if(body2MinMax.maxValue <= body1MinMax.minValue) {
				//no collision
				result.magnitude = 0;
				result.x = 0;
				result.y = 0;
				result.isBody1Normal = false;
				return result;
			} else {
				//there may be a collision
				const overlap = body2MinMax.maxValue - Math.max(body2MinMax.minValue, body1MinMax.minValue);
				if(result.magnitude === 0) {
					result.magnitude = overlap;
					result.x = normal.x;
					result.y = normal.y;
					result.isBody1Normal = isBody1Normal;
					result.body1Index = body1MinMax.minIndex;
					result.body2Index = body2MinMax.maxIndex;
				} else if(overlap <= result.magnitude) {
					result.magnitude = overlap;
					result.x = normal.x;
					result.y = normal.y;
					result.isBody1Normal = isBody1Normal;
					result.body1Index = body1MinMax.minIndex;
					result.body2Index = body2MinMax.maxIndex;
				}
			}
		}

		return result;
	};

	const getMinMax = function(body, normal) {
		let minIndex = 0;
		let maxIndex = 0;
		let minValue;
		let maxValue;
		const centerValue = dotProduct(body.center, normal);
 		for(let i = 0; i < body.points.length; i++) {
			const point = body.points[i];
			const dot = Math.round(dotProduct(point, normal));
			if(i === 0) {
				minValue = dot;
				maxValue = dot;
			} else if(dot < minValue) {
				minValue = dot;
				minIndex = i;
			} else if(dot > maxValue) {
				maxValue = dot;
				maxIndex = i;
			}
		}

		return {minIndex:minIndex, minValue:minValue, maxIndex:maxIndex, maxValue:maxValue, centerValue:centerValue};
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
