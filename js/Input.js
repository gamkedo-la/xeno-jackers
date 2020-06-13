//Input
const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;

// arrow keys
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

// wasd
// TODO support ZQSD (for azerty keyboards)
const KEY_LEFT2 = 65; // TODO: also support Q
const KEY_UP2 = 87; // TODO: also support Z
const KEY_RIGHT2 = 68;
const KEY_DOWN2 = 83;

const DIGIT_0 = 48;
const DIGIT_1 = 49;
const DIGIT_2 = 50;

const DIGIT_3 = 51;
const DIGIT_4 = 52;
const DIGIT_5 = 53;
const DIGIT_6 = 54;
const DIGIT_7 = 55;

const DIGIT_8 = 56;
const DIGIT_9 = 57;

const KEY_A = 65;
const KEY_B = 66;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_H = 72;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_P = 80;
const KEY_Q = 81;
const KEY_R = 82;
const KEY_S = 83;
const KEY_T = 84;
const KEY_U = 85;
const KEY_V = 86;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Y = 89;
const KEY_Z = 90;

const KEY_PLUS = 187;
const KEY_MINUS = 189;
const KEY_TILDE = 192;

let mouseY = 0;
let mouseX = 0;
const LEFT_MOUSE_BUTTON = 'LeftMouseButton';
const RIGHT_MOUSE_BUTTON = 'RightMouseButton';
let didInteract = false;

const heldButtons = [];
const newlyPressed = [];
const ALIAS = {
	//	CLIMB:KEY_UP,
	WALK_LEFT: KEY_LEFT,
	WALK_RIGHT: KEY_RIGHT,
	ATTACK: KEY_SPACE,
	JUMP: KEY_UP,
	CROUCH: KEY_DOWN,
	WALK_LEFT2: KEY_LEFT2,
	WALK_RIGHT2: KEY_RIGHT2,
	JUMP2: KEY_UP2,
	CROUCH2: KEY_DOWN2,
	BLOCK: KEY_F,
	SELECT1: KEY_ENTER,
	SELECT2: KEY_SPACE,
	HELP: KEY_H,
	SETTINGS: KEY_S,
	CREDITS: KEY_C,
	CHEATS: KEY_O,
	DEBUG: KEY_B,
	POINTER: LEFT_MOUSE_BUTTON,
	CONTEXT: RIGHT_MOUSE_BUTTON,
	UP: KEY_UP,
	DOWN: KEY_DOWN,
	LEFT: KEY_LEFT,
	RIGHT: KEY_RIGHT,
	UP2: KEY_UP2,
	DOWN2: KEY_DOWN2,
	LEFT2: KEY_LEFT2,
	RIGHT2: KEY_RIGHT2,
	THUMBUP: KEY_T,
	VOLUME_UP: KEY_PLUS,
	VOLUME_DOWN: KEY_MINUS
}

function initializeInput() {
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);
	document.addEventListener("mousedown", mouseButtonPressed);
	document.addEventListener("mouseup", mouseButtonReleased);
	document.addEventListener('mousemove', calculateMousePos);
}

function notifyCurrentScene(newInput, pressed) {
	if (!SceneState.control(newInput, pressed, heldButtons)) {
		//Do something if required because the scene didn't handle the input
	}
}

function keyPress(evt) {
	evt.preventDefault();

	if (evt.keyCode === KEY_PLUS) {
		turnVolumeUp();
		return;
	} else if (evt.keyCode === KEY_MINUS) {
		turnVolumeDown();
		return;
	}

	if (evt.keyCode == KEY_M)
		toggleMute();

	let isNewKey = true;
	for (let i = 0; i < heldButtons.length; i++) {
		if (heldButtons[i] === evt.keyCode) {
			isNewKey = false;
			break;
		}
	}

	notifyCurrentScene(evt.keyCode, true);

	if (isNewKey) {
		heldButtons.push(evt.keyCode);
		newlyPressed.push(evt.keyCode);
	}
}

function keyRelease(evt) {
	evt.preventDefault();

	const index = heldButtons.indexOf(evt.keyCode);
	if (index >= 0) {
		heldButtons.splice(index, 1);
		notifyCurrentScene(evt.keyCode, false);
	}
}

function mouseButtonPressed(evt) {

	if (!didInteract) { // very first click ever?
		didInteract = true;
		console.log("First click, audio now available, starting bg music.")
		if (currentBackgroundMusic) {
			currentBackgroundMusic.resumeSound();
		}
	}

	evt.preventDefault();

	if (evt.button === 0) {//left mouse button is button 0
		heldButtons.push(LEFT_MOUSE_BUTTON);
		notifyCurrentScene(LEFT_MOUSE_BUTTON, true);
	} else if (evt.button === 1) {//right mouse button is button 1
		heldButtons.push(RIGHT_MOUSE_BUTTON);
		notifyCurrentScene(RIGHT_MOUSE_BUTTON, true);
	}
}

function mouseButtonReleased(evt) {
	evt.preventDefault();

	if (evt.button === 0) {//left mouse button is button 0
		const index = heldButtons.indexOf(LEFT_MOUSE_BUTTON);
		if (index >= 0) {
			heldButtons.splice(index, 1);
			notifyCurrentScene(LEFT_MOUSE_BUTTON, false);
		}
	} else if (evt.button === 1) {//right mouse button is button 1
		const index = heldButtons.indexOf(RIGHT_MOUSE_BUTTON);
		if (index >= 0) {
			heldButtons.splice(index, 1);
			notifyCurrentScene(RIGHT_MOUSE_BUTTON, false);
		}
	}
}

function calculateMousePos(evt) {
	const rect = canvas.getBoundingClientRect();
	mouseX = (evt.clientX - rect.left) / ((rect.right - rect.left) / 160);
	mouseY = (evt.clientY - rect.top) / ((rect.bottom - rect.top) / 144);
}

function mouseInside(x, y, width, height) {
	return mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;
}

function pointInside(pointX, pointY, x, y, width, height) {
	return pointX > x && pointX < x + width && pointY > y && pointY < y + height;
}

function getKeyChecker(keys) {
	const keyChecker = function() {
		for (let i=0; i<heldButtons.length; i++) {
			for (let j=0; j<keys.length; j++) {
				if (heldButtons[i] == keys[j]) {
					return true;
				}
			}
		}
		return false;
	};
	return keyChecker;
}

function getExclusiveKeyChecker(keys) {
	const keysSet = new Set(keys)
	const exclusiveKeyChecker = function() {
		if (heldButtons.length != 1) {
			return false;
		}
		const heldSet = new Set(heldButtons);
		for (let key of keysSet) {
			heldSet.delete(key);
			if (heldSet.size == 0) {
				break;
			}
		}
		return heldSet.size == 0;
	};
	return exclusiveKeyChecker;
}

function getNewKeyChecker(keys) {
	const keyChecker = function() {
		for (let i=0; i<newlyPressed.length; i++) {
			for (let j=0; j<keys.length; j++) {
				if (newlyPressed[i] == keys[j]) {
					return true;
				}
			}
		}
		return false;
	};
	return keyChecker;
}

function checkForPressedKeys(keys) {
	return getKeyChecker(keys)();
}
