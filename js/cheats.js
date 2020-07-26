// The cheatcode buffer to store strings between key presses
var cheatBuffer = "";

//set this to every debug only cheatcode in the "active:" section
//for quick on and off switching
var DEBUG_CHEATS = true;

//INFO: This is the cheat list array in which you can simply copy
//the whole "cheat ={...}" part and insert your own stuff.
//code: The cheatcode "code", must be all lowercase because uppercase is reserved to special buttons.
//active: Tells if the cheatcode is enabled or disabled. Action will not run if disabled. Takes true or false.
//action: Insert the code that should run when a cheatcode gets activated here.

var cheatList = [
	cheat = {
		//This could kill someone
		code: 'kill',
		active: true,
		action: function() {
		}
	},
	cheat = {
		// "i" like i need coffee
		code: 'i',
		active: DEBUG_CHEATS,
		action: function() {
		}
	},
	cheat = {
		code: '1',
		active: DEBUG_CHEATS,
		action: function() {
			currentLevelName = MAP_NAME.Bar;
			SceneState.scenes[SCENE.GAME].reset();
			SceneState.setState(SCENE.GAME);
		}
	},
	cheat = {
		code: '2',
		active: DEBUG_CHEATS,
		action: function() {
			currentLevelName = MAP_NAME.Highway;
			SceneState.scenes[SCENE.GAME].reset();
			SceneState.setState(SCENE.GAME);
		}
	},
	cheat = {
		code: '3',
		active: DEBUG_CHEATS,
		action: function() {
			currentLevelName = MAP_NAME.Area51;
			SceneState.scenes[SCENE.GAME].reset();
			SceneState.setState(SCENE.GAME);
		}
	},
	cheat = {
		code: '4',
		active: DEBUG_CHEATS,
		action: function() {
			currentLevelName = MAP_NAME.Boss;
			SceneState.scenes[SCENE.GAME].reset();
			SceneState.setState(SCENE.GAME);
		}
	},
	cheat = {
		code: 'chain',
		active: DEBUG_CHEATS,
		action: function() {
			player.didCollideWith({type:EntityType.ChainPickup});
		}
	},
	cheat = {
		code: 'wheel',
		active: DEBUG_CHEATS,
		action: function() {
			player.didCollideWith({type:EntityType.WheelPickup});
		}
	},
	cheat = {
		code: 'handle',
		active: DEBUG_CHEATS,
		action: function() {
			player.didCollideWith({type:EntityType.HandlebarPickup});
		}
	},
	cheat = {
		code: 'engine',
		active: DEBUG_CHEATS,
		action: function() {
			player.didCollideWith({type:EntityType.EnginePickup});
		}
	}
];

//The cheatcode function, nothing interresting here.
function cheats(key) {
	var mightMatchCode = 0; //counts possible solutions
	var keyBuffer = "";
	
	// Turn inputs to lowercase and special case buttons to uppercase letters
	if(key.length === 1) {
		keyBuffer = key.toLowerCase();
	} else if(key === "ArrowUp") {
		keyBuffer = "U";
	} else if(key === "ArrowDown") {
		keyBuffer = "D";
	} else if(key === "ArrowLeft") {
		keyBuffer = "L";
	} else if(key === "ArrowRight") {
		keyBuffer = "R";
	}
	
	if(keyBuffer != "") {
		//add the pressed key to the current buffer string
		cheatBuffer += keyBuffer;
		//run a check for each cheatcode in the array
		cheatList.forEach (function (val,index) {

			//Give points for each cheatCode in the array
			mightMatchCode++;

			//check if cheatbuffer string matches to an element
			for (var i = 0; i < cheatBuffer.length++; i++) {	
				if (cheatBuffer.charAt(i) == val.code.charAt(i)) {
					
					//If cheatcode fully matches
					if(cheatBuffer == val.code) {
						//is cheatcode enabled?		
						if(val.active == true) {
							val.action();			
						}
					}
				} else {
					//remove point if string doesnt matched
					mightMatchCode--;
					break;						
				}
			}
		});

		//Reset complete string if nothing has matched.
		//We keep the string in the cheatbuffer if we still have possible matches left.
		if (mightMatchCode == 0 && keyBuffer.length == 1 && keyBuffer != " " && cheatBuffer.length > 1) {
			cheatBuffer = "";
			//We run this to see if it was a single letter cheatCode
			cheats(keyBuffer);
		}
	}
}
