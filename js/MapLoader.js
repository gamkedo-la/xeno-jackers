//Map Object
function Map(layers, name) {
    this.name = name;
    this.skybox = {};
    this.farBackgroundTiles = {};
    this.nearBackgroundTiles = {};
    this.colliders = [];
    this.collisionTiles = {};
    this.entities = [];
    this.foregroundTiles = {};
    this.playerSpawn = null;

    for(let layer of layers) {
        if(layer.name === MAP_LAYER_NAME.Skybox) {
            this.skybox.image = getSkyboxForName(layer.image);
            this.skybox.x = layer.x;
            this.skybox.y = layer.y;
        } else if(layer.name === MAP_LAYER_NAME.FarBackgroundTiles) {
            this.farBackgroundTiles.tiles = layer.data;
            this.farBackgroundTiles.widthInTiles = layer.width;
            this.farBackgroundTiles.heightInTiles = layer.height;
        } else if(layer.name === MAP_LAYER_NAME.NearBackgroundTiles) {
            this.nearBackgroundTiles.tiles = layer.data;
            this.nearBackgroundTiles.widthInTiles = layer.width;
            this.nearBackgroundTiles.heightInTiles = layer.height;
        } else if(layer.name === MAP_LAYER_NAME.CollisionTiles) {
            this.collisionTiles.tiles = layer.data;
            this.collisionTiles.widthInTiles = layer.width;
            this.collisionTiles.heightInTiles = layer.height;
        } else if(layer.name === MAP_LAYER_NAME.EnvironmentColliders) {
            for(let collider of layer.objects) {
                this.colliders.push(new EnvironmentCollider(collider.type, collider.polygon, {x:collider.x, y:collider.y}));
            }
        } else if(layer.name === MAP_LAYER_NAME.Entities) {
            for(let entity of layer.objects) {
                if(entity.type === EntityType.Player) {
                    this.playerSpawn = {x:null, y:null};
                    this.playerSpawn.x = Math.round(entity.x);
                    this.playerSpawn.y = Math.round(entity.y);
                } else {
                    this.entities.push({x: Math.round(entity.x), y:Math.round(entity.y), type:entity.type});
                }
            }
        } else if(layer.name === MAP_LAYER_NAME.ForegroundTiles) {
            this.foregroundTiles.tiles = layer.data;
            this.foregroundTiles.widthInTiles = layer.width;
            this.foregroundTiles.heightInTiles = layer.height;
        }
    }
}

//MapLoader.js
function MapLoader() {
    this.currentMap = null;
    this.foregroundMap = null;
    this.backgroundMap = null;

    this.loadMap = function(name) {
        if((this.currentMap != null) && 
        (this.currentMap.name === name)) {
            return this.currentMap;
        }

        switch(name) {
            case MAP_NAME.Bar:
                this.currentMap = loadBar();
                //this.foregroundMap = null;
                break;
            case MAP_NAME.Highway:
                this.currentMap = loadHighway();
                this.backgroundMap = loadBackground();
                this.foregroundMap = loadForeground();
                break;
            case MAP_NAME.Area51:
                this.currentMap = loadArea51();
                //this.foregroundMap = null;
                break;
            case MAP_NAME.Boss:
                this.currentMap = loadBoss();
                //this.foregroundMap = null;
                break;
        }

        return this.currentMap;
    };

    this.goToNextMap = function() {
        switch(this.currentMap) {
            case MAP_NAME.Bar:
                this.currentMap = loadHighway();
                break;
            case MAP_NAME.Highway:
                this.currentMap = loadArea51();
                break;
            case MAP_NAME.Area51:
                this.currentMap = loadBoss();
                break;
            case MAP_NAME.Boss:
                this.currentMap = null;
                break;
        }
    };
    
    const loadBar = function() {
        const layers = TileMaps[MAP_NAME.Bar].layers;
        return new Map(layers, MAP_NAME.Bar);
    };
    
    const loadHighway = function() {
        const layers = TileMaps[MAP_NAME.Highway].layers;
        return new Map(layers, MAP_NAME.Highway);
    };

    const loadForeground = function() {
        const layers = TileMaps[MAP_NAME.Foreground].layers;
        const foregroundMap = new Map(layers, MAP_NAME.Foreground);
        foregroundMap.widthInTiles = TileMaps[MAP_NAME.Foreground].width;
        foregroundMap.heightInTiles = TileMaps[MAP_NAME.Foreground].height;
        return foregroundMap;
    };

    const loadBackground = function() {
        const layers = TileMaps[MAP_NAME.Background].layers;
        const backgroundMap = new Map(layers, MAP_NAME.Background);
        backgroundMap.widthInTiles = TileMaps[MAP_NAME.Background].width;
        backgroundMap.heightInTiles = TileMaps[MAP_NAME.Background].height;
        return backgroundMap;
    };

    const loadArea51 = function() {
        const layers = TileMaps[MAP_NAME.Area51].layers;
        return new Map(layers, MAP_NAME.Area51);
    };
    
    const loadBoss = function() {
        const layers = TileMaps.boss.layers;
        return new Map(layers, MAP_NAME.Boss);
    };
}