//Screen State
const SceneState = {
	log : [],
	currentScene: SCENE.TITLE,
	pauseCause:null,
	scenes: {
//		[SCENE.LOADING]: new LoadingScreen(),
		[SCENE.TITLE]: new TitleScene(),
        [SCENE.OPTIONS]: new OptionsScene(),
		[SCENE.GAME]: new GameScene(),
		[SCENE.PAUSE]: new PauseScene(),
		[SCENE.CREDITS]: new CreditsScene(),
		[SCENE.HELP]: new HelpScene(),
		[SCENE.LVL1Intro]: new Lvl1IntroCutScene(),
		[SCENE.LVL1LVL2]: new Lvl1ToLvl2CutScene(),
//		[SCENE.GAMEOVER]: new GameOverScene(),
//		[SCENE.ENDING]: new EndgameScene()
	},
	setState: function(newScene, properties) {
        this.scenes[this.currentScene].transitionOut();
        this.log.push(this.currentScene);
		this.currentScene = newScene;
		this.scenes[this.currentScene].properties = properties;
		this.scenes[this.currentScene].transitionIn();
		return this;
	},
	getPreviousState: function() {
		return this.log[this.log.length-1];
	},
	run: function(deltaTime) {
		this.scenes[this.currentScene].run(deltaTime);

		if (isMuted) {
			fontRenderer.drawString(canvasContext, 760, 10, "MUTED", FONT.White, 2);
		}
	},
	control: function(newKeyEvent, pressed, pressedKeys) {
		return this.scenes[this.currentScene].control(newKeyEvent, pressed, pressedKeys);
    }
};