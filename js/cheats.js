var cheatBuffer = "";

// Note: single character cheats dont work, must be atleast 2 characters and all lowercase
var cheatList = [
	"kill", 		// 0 - opens the gameover screen
	"speed",		// 1 - gives the palyer speedburst for 600s
	"UUDDLRLRba",	// 2 - Konami code
	"shield",		// 3 - get super shield
	"chris",		// 4 - super secret chris weapon
	"atom",			// 5 - atomic weapon
	"mid",			// 6 - mid weapon
	"laser",		// 7 - laser weapon
];
var mouseAction ={
	selected: undefined,
	action: undefined
};

function cheats(key) {
	var mightMatchCode = 0; //counts possible solutions
	var keyBuffer = "";

	// Turn inputs to lowercase and special case buttons to uppercase letters
	if(key.length == 1){
		keyBuffer = key.toLowerCase();
	}else if(key == "ArrowUp"){
		keyBuffer = "U";
	}else if(key == "ArrowDown"){
		keyBuffer = "D";
	}else if(key == "ArrowLeft"){
		keyBuffer = "L";
	}else if(key == "ArrowRight"){
		keyBuffer = "R";
	}

	
	if(keyBuffer != " "){
		cheatBuffer += keyBuffer;
		//run a check for each cheatcode in the array
		cheatList.forEach (function (val,index){
			//Give points for each index
			mightMatchCode++;

			//check if cheatbuffer string matches to an element
			for (var i = 0; i < cheatBuffer.length++; i++){	
				if (cheatBuffer.charAt(i) == val.charAt(i)){
					
					//If cheatcode fully matches
					if(cheatBuffer == val){		
						console.log("cheat activated: " + val);
						switch (index) {
							case 0: //cheat: kill 
								console.log("testi");
								break;	
							case 1: //cheat: speed
								p1.addSpeed(600);
								break;
							case 2: //cheat: konami
								p1.addSpeed(600);
								break;
							case 3: //cheat: Super shield
								p1.addShield(6);
								break;
							case 4: //cheat: Chris
								p1.chrisCode = true;
								p1.addWeapon("chris", 1)
								p1.addShield(6);
								break;
							case 5: //cheat: atom weapon
								p1.addWeapon("atom", 1)
								break;
							case 6: //cheat: mid weapon
								p1.addWeapon("mid", 1)
								break;
							case 7: //cheat: laser weapon
								p1.addWeapon("laser", 1)
								break;
						}
						cheatBuffer = "";
						break;				
					}

				}else{
					//remove point if string doesnt match
					mightMatchCode--;
					break;						
				}
			}
		});
			
		//console.log(`buffer: ${cheatBuffer}` + " " + mightMatchCode+ " ");

		// reset complete string if nothing matched.
		if (mightMatchCode == 0 && keyBuffer.length == 1 && keyBuffer != " ") {
			cheatBuffer = keyBuffer;
			//console.log("bufferReset")
		}
	}
}
