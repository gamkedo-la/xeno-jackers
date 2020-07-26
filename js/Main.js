//Main for Xeno Jackers
window.onload = function() {
    console.log("Game loaded")
    canvas = document.getElementById("gameCanvas");// document.createElement("canvas");
    canvasContext = canvas.getContext("2d");

	drawRect(0, 0, canvas.width, canvas.height, Color.Black);
	
    colorText("L..O..A..D..I..N..G..", canvas.width / 2, canvas.height / 2, Color.White, Fonts.MainTitle, TextAlignment.Center, opacity = 1);

    TitleTextX = canvas.width / 2;
    subTitleTextX = canvas.width / 2;
    opacity = 0;

	initializeInput();
	configureGameAudio();
	loadAudio();
	currentBackgroundMusic.loopSong(menuMusic);
	loadGamkedoLogo();

    canvas.focus(); // tell browser the keyboard focus is the game canvas
	window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

};

function loadingDoneSoStartGame() {
	if(finishedLoading) {
        console.log("All downloads completed");
		timer = new Chronogram();
		fontRenderer = new FontBuilder();
		if(DEBUG) {
			SceneState.setState(SCENE.GAME);
		} else {
			SceneState.setState(SCENE.TITLE);
		}
		requestAnimationFrame(update);
	} else {
		finishedLoading = true;
	}
};

function updateButtonText() {
	for (let i = 0; i < mainMenu.buttons.length; i++) {
		mainMenu.buttons[i].txt = getLocalizedStringForKey(mainMenu.buttons[i].txtKey);
	}
}

var storedDeltaTime = 0; // framerate limiter

function update() {
    var deltaTime = timer.update();
    // avoid divide by zero problems on infinitely fast computers
    if (deltaTime<1) deltaTime = 1;
    // force 60fps simulation timestep
    deltaTime += storedDeltaTime;
    if (deltaTime<16) {
        storedDeltaTime = deltaTime;
        // store the unsimulated ms 
        // and do not update (yet)
    } else {
        // at least 1/60 of a second has elapsed
        // run the normal update
        storedDeltaTime = 0;
        SceneState.run(deltaTime);
        drawPaletteEffect();
        if (gamepad) gamepad.update();
    }

	requestAnimationFrame(update);
};

function startGame() {
	if((firstLoad === null) || (firstLoad === undefined)) {
		firstLoad = false;
		localStorage.setItem(localStorageKey.FirstLoad, firstLoad);

		openHelp();
		
		return;
	} 

    console.log("Starting game");
    windowState.help = false;
    windowState.mainMenu = false;
    windowState.playing = true;
};

function drawAll() {

};

function moveAll() {

};

function windowOnFocus() {
    console.log("Game received keyboard focus");
    if(SceneState.currentScene === SCENE.PAUSE) {
		timer.skipToNow();
		gameIsPaused = false;
		resumeSound.play();
		SceneState.setState(SCENE.GAME);
	}
}

function windowOnBlur() {
    console.log("Game lost keyboard focus");
	if(SceneState.currentScene === SCENE.GAME) {
		gameIsPaused = true;
		pauseSound.play();
		SceneState.setState(SCENE.PAUSE);
	}
}