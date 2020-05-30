//SoundandMusic
let audioFormat;
let musicSound = null;
let pauseSound;
let resumeSound;
let menuSelect; //confirm any menu item
let menuNav1; //up or down navigation through any menu
let menuNav2;
let alienBossDeath;
let alienCackle1;
let alienGrowl2;
let hurt1;
let playerPickup1;
let playerPickup2;
let chainAttack1;
let chainAttack2;
let nodeActivate;
let menuMusic = MENU_MUSIC_FILENAME;
let musicVolume;
let effectsVolume;
let currentBackgroundMusic;
const VOLUME_INCREMENT = 0.05;
const VOLUME_MUSIC = 1.0;

function configureGameAudio() {
	currentBackgroundMusic = new backgroundMusicClass();

	musicVolume = parseFloat(localStorage.getItem(localStorageKey.MusicVolume));
	if (Number.isNaN(musicVolume)) musicVolume = VOLUME_MUSIC;
	localStorage.setItem(localStorageKey.MusicVolume, musicVolume);

	effectsVolume = parseFloat(localStorage.getItem(localStorageKey.SFXVolume));
	if (Number.isNaN(effectsVolume)) effectsVolume = VOLUME_MUSIC;
	localStorage.setItem(localStorageKey.SFXVolume, effectsVolume);

}

function loadAudio() {
	pauseSound = new SoundOverlapsClass(assetPath.Audio + "pause1");
	resumeSound = new SoundOverlapsClass(assetPath.Audio + "pause1");
	menuSelect = new SoundOverlapsClass(assetPath.Audio + "menu_select");
	menuNav1 = new SoundOverlapsClass(assetPath.Audio + "menu_nav1");
	menuNav2 = new SoundOverlapsClass(assetPath.Audio + "menu_nav2");
	alienBossDeath = new SoundOverlapsClass(assetPath.Audio + "alien_boss_death");
	alienCackle1 = new SoundOverlapsClass(assetPath.Audio + "alien_cackle1");
	alienGrowl2 = new SoundOverlapsClass(assetPath.Audio + "alien_growl2");
	hurt1 = new SoundOverlapsClass(assetPath.Audio + "hit_hurt1");
	playerPickup1 = new SoundOverlapsClass(assetPath.Audio + "player_pickup1");
	playerPickup2 = new SoundOverlapsClass(assetPath.Audio + "player_pickup2");
	chainAttack1 = new SoundOverlapsClass(assetPath.Audio + "chain_attack1");
	chainAttack2 = new SoundOverlapsClass(assetPath.Audio + "chain_attack2");
	nodeActivate = new SoundOverlapsClass(assetPath.Audio + "node_activate");
}

function setFormat() {
	const audio = new Audio();
	if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
	}
}

function backgroundMusicClass() {
	this.loopSong = function (filenameWithPath) {
		console.log("Looping background music: " + filenameWithPath);
		setFormat(); // calling this to ensure that audioFormat is set before needed

		if (musicSound != null) {
			musicSound.pause();
			musicSound = null;
		}
		musicSound = new Audio(filenameWithPath + audioFormat);
		musicSound.loop = true;
		this.setVolume(musicVolume);
	}

	this.pauseSound = function () {
		musicSound.pause();
	}

	this.resumeSound = function () {
		if (didInteract) {
			musicSound.play();
		}
	}

	this.startOrStopMusic = function () {
		if (didInteract) {
			if (musicSound.paused) {
				musicSound.play();
			} else {
				musicSound.pause();
			}
		}
	}

	this.setVolume = function (volume) {
		// Multipliction by a boolean serves as 1 for true and 0 for false
		console.log("Music Sound: " + musicSound + ", musicSound.volume: " + musicSound.volume);
		if (isMuted) {
			musicSound.volume = 0;
		} else {
			musicSound.volume = Math.pow(volume, 2);
		}

		if (musicSound.volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			if (didInteract) {
				musicSound.play();
			}
		}
	}
}

function SoundOverlapsClass(filenameWithPath) {
	setFormat();

	const fullFilename = filenameWithPath;
	let soundIndex = 0;
	const sounds = [new Audio(fullFilename + audioFormat), new Audio(fullFilename + audioFormat)];

	this.play = function () {
		if (!sounds[soundIndex].paused) {
			sounds.splice(soundIndex, 0, new Audio(fullFilename + audioFormat));
		}
		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		if (didInteract) {
			sounds[soundIndex].play();
		}

		soundIndex = (++soundIndex) % sounds.length;
	}
}

function getRandomVolume() {
	var min = 0.9;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	if (!isMuted) {
		setMusicVolume(0);
		setEffectsVolume(0);
		isMuted = !isMuted;
	}
	else {
		isMuted = !isMuted;
		currentBackgroundMusic.setVolume(VOLUME_MUSIC);
		setEffectsVolume(VOLUME_MUSIC);
	}
}

function setEffectsVolume(amount) {
	effectsVolume = amount;
	if (effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
}

function setMusicVolume(amount) {
	musicVolume = amount;
	if (musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	currentBackgroundMusic.setVolume(musicVolume);
}

function turnVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}