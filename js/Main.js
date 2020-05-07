//Main for Xeno Jackers
window.onload = function() {
    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 640;
    canvas.height = 576;
	drawRect(0, 0, canvas.width, canvas.height, Color.Black);
	
    colorText("L..O..A..D..I..N..G..", canvas.width / 2, canvas.height / 2, Color.White, Fonts.MainTitle, TextAlignment.Center, opacity = 1);

    TitleTextX = canvas.width / 2;
    subTitleTextX = canvas.width / 2;
    opacity = 0;

	initializeInput();
	configureGameAudio();
	loadAudio();
//	currentBackgroundMusic.loopSong(menuMusic);//TODO: Restore once there is background music
	loadGamkedoLogo();

	window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);
};

function loadingDoneSoStartGame() {
	if(finishedLoading) {
		timer = new Chronogram();
		fontRenderer = new FontBuilder(fontSheet, CHAR_WIDTH, CHAR_HEIGHT);
		SceneState.setState(SCENE.TITLE);
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

function update() {
	const deltaTime = timer.update();
	SceneState.run(deltaTime);
	requestAnimationFrame(update);
};

function startGame() {
	if((firstLoad === null) || (firstLoad === undefined)) {
		firstLoad = false;
		localStorage.setItem(localStorageKey.FirstLoad, firstLoad);

		openHelp();
		
		return;
	} 

    windowState.help = false;
    windowState.mainMenu = false;
    windowState.playing = true;
};

function drawAll() {

};

function moveAll() {

};

function windowOnFocus() {
	if(SceneState.currentScene === SCENE.PAUSE) {
		gameIsPaused = false;
		resumeSound.play();
		SceneState.setState(SCENE.GAME);
	}
}

function windowOnBlur() {
	if(SceneState.currentScene === SCENE.GAME) {
		gameIsPaused = true;
		pauseSound.play();
		SceneState.setState(SCENE.PAUSE);
	}
}