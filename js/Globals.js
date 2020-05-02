//Globals
//----------Drawing and Canvas---------//
let canvas;
let canvasContext;
let currentLanguage;

let DEBUG = false;
let CHEATS_ACTIVE = false;

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
	MusicVolume:"musicVolume",
	SFXVolume:"effectsVolume",
    Language:"language",
    FirstLoad:"firstLoad"
}

//----------State Management----------//
let pauseManager;
const CAUSE = {
	Keypress: 'keypress',
	Focus: 'focus',
}

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

let firstLoad = localStorage.getItem(localStorageKey.FirstLoad);
let timer;
let worldSpeed = 1;

//------------Asset Management----------//
const assetPath = {
	Audio:"./audio/",
	Image:"img/"
}

//---------------Audio------------------//
let isMuted = false;

//------------Text------------------//
const TextAlignment = {
	Left:"left",
	Right:"right",
	Center:"center"
};

const Fonts = {
	MainTitle:"40px Tahoma",
	Subtitle:"30px Tahoma",
	ButtonTitle:"20px Tahoma",
	CreditsText:"16px Tahoma"
};

const fontOverhangRatio = 4/5; // Currently 4/5 is correct for "Tahoma" font. Change if font changes