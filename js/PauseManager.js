//Pause Manager
function PauseManager() {
    let cause = null;
	this.getIsPaused = function() {
		if(cause === null) {
			return false;
		} else {
			return true;
		}
	}

	this.pauseGame = function(pauseCause) {
		if(cause === null) {
			this.togglePause(pauseCause);
		} else if(pauseCause === CAUSE.Keypress) {
			cause = CAUSE.Keypress;
		}
	}

	this.resumeGame = function(pauseCause) {
		if(cause === null) {return;}

		if((pauseCause === CAUSE.Keypress) || ((pauseCause === CAUSE.Focus) && (cause === CAUSE.Focus))) {
			this.togglePause(null);
		}
	}

	this.togglePause = function(pauseCause) {
		if((cause === CAUSE.Keypress) && (pauseCause === CAUSE.Keypress)) {
			cause = null;
		} else {
			cause = pauseCause;
		}

		if(cause === null) {
			resumeSound.play();
//			currentBackgroundMusic.pauseSound();//TODO: restore once there is background music
			requestAnimationFrame(update);
		} else {
			pauseSound.play();
//			currentBackgroundMusic.resumeSound();//TODO: restore once there is background music
		}
	}
}
