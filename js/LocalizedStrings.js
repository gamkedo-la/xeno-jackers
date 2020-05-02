//Localized Strings
const Language = {
    English:"English",
    Spanish:"Spanish"
}

const STRINGS_KEY = {
    Help:"[H] for Help",
    Credits:"[C] for Credits",
    Settings:"[S] for Settings",
    Play:"[Enter] to Play",
    MusicVolume:"Music Volume",
    SFXVolume:"SFX Volume",
    Loading:"Loading",
    Paused:"Paused",
    Title:"Title",
    Subtitle:"Subtitle",
    English:"English",
    Spanish:"Spanish",
    EnterToReturn:"EnterToReturn",
    HowToPlay:"HowToPlay",
    Muted:"Muted",
    Back:"Back",
    HelpScreenTitle:"Help Title",
    SettingsScreenTitle:"Settings Title",
    CreditsScreenTitle:"Credits Title"
}

function getLocalizedStringForKey(key) {
    return userStrings[currentLanguage][key];
}

const userStrings = {
    English: {
        [STRINGS_KEY.Help]:"[H] for Help",
        [STRINGS_KEY.Credits]:"[C] for Credits",
        [STRINGS_KEY.Settings]:"[S] for Settings",
        [STRINGS_KEY.Play]:"[SPACE] to Play",
        [STRINGS_KEY.MusicVolume]:"Music Volume",
        [STRINGS_KEY.SFXVolume]:"SFX Volume",
        [STRINGS_KEY.Loading]:"LOADING...",
        [STRINGS_KEY.Paused]:"- P A U S E D -",
        [STRINGS_KEY.Title]:"Kung Twu",
        [STRINGS_KEY.Subtitle]:"A Martial Arts Tale",
        [STRINGS_KEY.English]:"English",
        [STRINGS_KEY.Spanish]:"Español",
        [STRINGS_KEY.EnterToReturn]:"Press [ENTER] to Return",
        [STRINGS_KEY.HowToPlay]:"How to Play",
        [STRINGS_KEY.Muted]:"Muted",
        [STRINGS_KEY.Back]:"Back",
        [STRINGS_KEY.HelpScreenTitle]:"HELP",
        [STRINGS_KEY.SettingsScreenTitle]:"SETTINGS",
        [STRINGS_KEY.CreditsScreenTitle]:"CREDITS"
    },
    
    Spanish: {
        [STRINGS_KEY.Help]:"[H] Ayuda",
        [STRINGS_KEY.Credits]:"[C] Créditos",
        [STRINGS_KEY.Settings]:"[S] Configuraciones",
        [STRINGS_KEY.Play]:"[SPACE] Jugar",
        [STRINGS_KEY.MusicVolume]:"Volumen de la Música",
        [STRINGS_KEY.SFXVolume]:"Volumen de SFX",
        [STRINGS_KEY.Loading]:"CARGANDO...",
        [STRINGS_KEY.Paused]:"- P A U S A D O -",
        [STRINGS_KEY.Title]:"Kung Twu",
        [STRINGS_KEY.Subtitle]:"Un Cuento de Artes Marciales",
        [STRINGS_KEY.English]:"English",
        [STRINGS_KEY.Spanish]:"Español",
        [STRINGS_KEY.EnterToReturn]:"Presiona [Enter] para Regresar",
        [STRINGS_KEY.HowToPlay]:"Cómo Jugar",
        [STRINGS_KEY.Muted]:"Silenciado",
        [STRINGS_KEY.Back]:"[BACK]",
        [STRINGS_KEY.HelpScreenTitle]:"[HELP]",
        [STRINGS_KEY.SettingsScreenTitle]:"[SETTINGS]",
        [STRINGS_KEY.CreditsScreenTitle]:"[CREDITS]"
    }
}