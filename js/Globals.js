//Globals
//----------Drawing and Canvas---------//
let canvas;
let canvasContext;
let gamepad;
let DEBUG = false;
let CHEATS_ACTIVE = false;
let DRAW_COLLIDERS = false;

const GRAVITY = 350; //220 - lower number is less gravity force and more hang time
const MAX_Y_SPEED = 95; //65 - launch off ground speed for player jump

const COLLIDER_COLOR = 'aqua';
const MENU_MUSIC_FILENAME = 'audio/XJ_SAGA';
const LEVEL_1_MUSIC_FILENAME = 'audio/level1MusicV1';
const LEVEL_2_MUSIC_FILENAME = 'audio/level1MusicV1';
const LEVEL_3_MUSIC_FILENAME = 'audio/Shadow_51';
const GAMEOVER_MUSIC_FILENAME = 'audio/XJ_SAGA';
const ENDING_MUSIC_FILENAME = 'audio/XJ_SAGA';

const GAME_SCALE = 1;

const canvasClearColor = "black";

const Color = {
	Red:"red",
	Blue:"blue",
	Green:"green",
	White:"white",
	Black:"black",
	Yellow:"yellow",
	Purple:"purple",
	Aqua:"aqua"
};

//--------------Player-----------------//
let player = null;

const POINTS = {
	EnemyBiker:100,
	EnemyBiker2:50,
	EnemyBiker3:50,
	EnemyCrawler:50,
	EnemyFlyer:150,
	EnemyAlienGuard:150,
	EnemyMech: 1000,
	WallOrb: 300,
	FlyingFist: 50,
	FlyingSpit: 50,
	EnemyBullet: 50,
	BikePart:500,
	Boss:5000,
	BeatGame:5000
};

const PICKUP = {
	Chain:"chain",
	Wheel:"wheel",
	Handlebar:"handlebar",
	Engine:"engine",
	Health:"health"
};

//---------------Persistence-----------//
const localStorageKey = {
	MusicVolume:"xeno_jackers_musicVolume",
	SFXVolume:"xeno_jackers_effectsVolume",
    FirstLoad:"xeno_jackers_firstLoad"
}

//----------State Management----------//
let gameIsPaused = false;
let worldSpeed = 1;

const SCENE = {
	LOADING:"loading",
	TITLE:"title",
	OPTIONS:"options",
	CREDITS:"credits",
	HELP:"help",
	PAUSE:"pause",
	GAME:"game",
	ENDING:"ending",
	LVL1Intro: "lvl1Intro",
	LVL1LVL2: "lvl1lvl2",
	LVL2LVL3: "lvl2lvl3",
	GAMEOVER: "gameover",
	WIN: "win"
}

const MAP_NAME = {
	Bar:"level_1b_bar",
	Highway:"level_2_highway",
	Foreground:"level_2_foreground_scroll",
	Background:"level_2_background_scroll",
	Area51:"level_3_area51",
	Boss:"boss",
};

const MAP_LAYER_NAME = {
	Skybox:"Skybox",
	FarBackgroundTiles:"FarBackgroundTiles",
	NearBackgroundTiles:"NearBackgroundTiles",
	EnvironmentColliders:"EnvironmentColliders",
	CollisionTiles:"CollisionTiles",
	Entities:"Entities",
	ForegroundTiles:"ForegroundTiles"
};

const TILE_WIDTH = 8;
const TILE_HEIGHT = 8;

let firstLoad = localStorage.getItem(localStorageKey.FirstLoad);
let currentLevelName = MAP_NAME.Bar;
let timer;

//------------Asset Management----------//
const assetPath = {
	Audio:"./audio/",
	Image:"img/"
}

//---------------Audio------------------//
let isMuted = false;

//------------Text------------------//
let fontRenderer;
const CHAR_WIDTH = 6;
const CHAR_HEIGHT = 9;

const TextAlignment = {
	Left:"left",
	Right:"right",
	Center:"center"
};

const Fonts = {
	MainTitle:"10px Tahoma",
	Subtitle:"7px Tahoma",
	ButtonTitle:"5px Tahoma",
	CreditsText:"4px Tahoma"
};

const fontOverhangRatio = 4/5; // Currently 4/5 is correct for "Tahoma" font. Change if font changes