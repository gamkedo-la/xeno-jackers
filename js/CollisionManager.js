//Collider
const ColliderType = {
	Polygon:"polygon",
	Circle:"circle"
};

function Collider(type, points = [], position = {x:0, y:0}, center = {x:0, y:0}, radius = 1) {
	this.type = type;
	this.center = center;
	this.radius = radius;
	this.points = points;
 	for(let i = 0; i < points.length; i++) {
		this.points[i] = {x:points[i].x, y:points[i].y};
	}

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
		
	if(this.type === ColliderType.Polygon) {
		this.points = points;
		this.findCenterAndRadiusOfPoints(this.points);
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
    
    this.isOnscreen = function(canvas) {
        const left = canvas.center.x - canvas.width / 2;
        const right = canvas.center.x + canvas.width / 2;
        const top = canvas.center.y - canvas.height / 2;
        const bottom = canvas.center.y + canvas.height / 2;

        if(this.type === ColliderType.Circle) {
            return isCircleOnScreen(left, top, right, bottom, this.position);
        } else {
            return isPolygonOnScreen(left, top, right, bottom, this.points);
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
        if((point.x > left) && 
            (point.x < right) && 
            (point.y > top) && 
            (point.y < bottom)) {
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
    let playerWeapons = new Set();
    let playerList = [player];

    this.player = player;

	this.setPlayer = function(newPlayer) {
        this.player = newPlayer;
        playerList = [newPlayer];
		return true;
	};

	this.addEntity = function(newEntity) {
        if(isEnemy(newEntity)) {
            addEnemy(newEntity);
        } else if(isEnemyWeapon(newEntity)) {
			addEnemyWeapon(newEntity);
		} else if(isEnvironment(newEntity)) {
			addEnvironment(newEntity);
		} else if(isPlayerWeapon(newEntity)) {
            addPlayerWeapon(newEntity);
        }

		const beforeLength = enemies.size;
		enemies.add(newEntity);

		return (!(beforeLength === enemies.size));
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
    
    const addPlayerWeapon = function(newWeapon) {
        const beforeLength = playerWeapons.size;
		playerWeapons.add(newWeapon);

		return (!(beforeLength === playerWeapons.size));
    };
	
	this.removeEntity = function(entityToRemove) {
        if(isEnemy(entityToRemove)) {
            removeEnemy(entityToRemove);
        } else if(isEnemyWeapon(entityToRemove)) {
			removeEnemyWeapon(entityToRemove);
		} else if(isEnvironment(entityToRemove)) {
			removeEnvironment(entityToRemove);
        } else if(isPlayerWeapon(entityToRemove)) {
            removePlayerWeapon(entityToRemove);
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
        if(playerWeapons.has(weaponToRemove)) {
			playerWeapons.delete(weaponToRemove);

			return true;
		}

		return false;
    };

	this.clearWorldAndBullets = function() {
		enemies.clear();
		enemyWeapons.clear();
        environment.clear();
//        playerWeapons.clear();//do we want this?
	};
    
	this.doCollisionChecks = function() {
        //Player vs Enemies
        checkCollsionsForLists(playerList, enemies);

        //Player vs Enemy Weapons
        checkCollsionsForLists(playerList, enemyWeapons);

        //Player vs Environment
        checkCollsionsForLists(playerList, environment);

        //Player Weapons vs Enemies
        checkCollsionsForLists(playerWeapons, enemies);

        //Player Weapons vs Enemy Weapons
        checkCollsionsForLists(playerWeapons, enemyWeapons);

        //Player Weapons vs Environment
        checkCollsionsForLists(playerWeapons, environment);

        //Enemy Weapons vs Environment
        checkCollsionsForLists(enemyWeapons, environment);

        //Enemies vs Environment
        checkCollsionsForLists(enemies, environment);
    };

    const checkCollsionsForLists = function(list1, list2) {
        for(let entity1 of list1) {
            if(!entity1.collisionBody.isOnscreen(canvas)) continue;//not on screen so bail early
			for(let entity2 of list2) {
                if(!entity2.collisionBody.isOnscreen(canvas)) continue;//not on screen so bail early
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
            
            if(checkCollisionBetween(entity1.collisionBody, entity2.collisionBody)) {
                entity1.didCollideWith(entity2);
                entity2.didCollideWith(entity1);
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
				return polygonVPolygon(body1, body2);
			} else if(body2.type === ColliderType.Circle) {
				return polygonVCircle(body1, body2);
			}
		} else if(body1.type === ColliderType.Circle) {
			if(body2.type === ColliderType.Polygon) {
				return polygonVCircle(body2, body1);//reverse the order so polygon passed as first parameter
			}
		}
	};

	const polygonVPolygon = function(body1, body2) {
		const body2Points = body2.points;
		for(let i = 0; i < body2Points.length; i++) {
			if(pointInPolygon(body2Points[i], body1.points)) {
				//at least 1 point of polygon2 is inside polygon1 => collision occurred

				return true;
			}
		}

		const body1Points = body1.points;
		for(let i = 0; i < body1Points.length; i++) {
			if(pointInPolygon(body1Points[i], body2.points)) {
				//at least 1 point of polygon2 is inside polygon1 => collision occurred

				return true;
			}
		}

		return false;
	};

	const pointInPolygon = function(target, polygon) {
		let temp1;
		let temp2;

		// How many times the ray crosses a line-segment
		let crossings = 0;

		// Iterate through each line
		for (let i = 0; i < polygon.length; i++) {
			if(polygon[i].x < polygon[(i + 1) % polygon.length].x) {
				temp1 = polygon[i].x;
				temp2 = polygon[(i + 1) % polygon.length].x;
			} else {
				temp1 = polygon[(i + 1) % polygon.length].x;
				temp2 = polygon[i].x;
			}

			//First check if the ray is possible to cross the line
			if (target.x > temp1 && target.x <= temp2 && (target.y < polygon[i].y || target.y <= polygon[(i + 1) % polygon.length].y)) {
				let eps = 0.000001;

				//Calculate the equation of the line
				let dx = polygon[(i + 1) % polygon.length].x - polygon[i].x;
				let dy = polygon[(i + 1) % polygon.length].y - polygon[i].y;
				let k;

				if (Math.abs(dx) < eps) {
					k = Number.MAX_VALUE;
				} else {
					k = dy / dx;
				}

				let m = polygon[i].y - k * polygon[i].x;
				//Find if the ray crosses the line
				let y2 = k * target.x + m;
				if (target.y <= y2) {
					crossings++;
				}
			}
		}

		if (crossings % 2 === 1) {
			return true;
		} else {
			return false;
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
					return true;
				}
			}
		}

		return false;
	}
}

function magnitudeOfVec(vector) {
	return Math.sqrt(((vector.x * vector.x) + (vector.y * vector.y)));
}

function dotProduct(vec1, vec2) {
	return (vec1.x * vec2.x) + (vec1.y * vec2.y);
}
