//Globals
//----------Drawing and Canvas---------//
let canvas;
let canvasContext;

let DEBUG = false;
let CHEATS_ACTIVE = false;
let DRAW_COLLIDERS = true;
const COLLIDER_COLOR = 'red';

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
	SETTINGS:"settings",
	CREDITS:"credits",
	HELP:"help",
	PAUSE:"pause",
	GAME:"game",
	ENDING:"ending"
}

const MAP_NAME = {
	Bar:"bar",
	Highway:"highway",
	Boss:"boss",
	TestMap:"testMap"
};

const MAP_LAYER_NAME = {
	Skybox:"Skybox",
	BackgroundTiles:"BackgroundTiles",
	Colliders:"Colliders",
	CollisionTiles:"CollisionTiles",
	Entities:"Entities",
	ForegroundTiles:"ForegroundTiles"
};

const TILE_WIDTH = 8;
const TILE_HEIGHT = 8;

let firstLoad = localStorage.getItem(localStorageKey.FirstLoad);
let currentLevelName = MAP_NAME.TestMap;
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