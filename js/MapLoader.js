//Map Object
function Map(layers) {
    this.skybox = {};
    this.backgroundTiles = {};
    this.colliders = [];
    this.collisionTiles = {};
    this.entities = [];
    this.foregroundTiles = {};

    for(let layer of layers) {
        if(layer.name === MAP_LAYER_NAME.Skybox) {
            this.skybox.image = getSkyboxForName(layer.image);
            this.skybox.x = layer.x;
            this.skybox.y = layer.y;
        } else if(layer.name === MAP_LAYER_NAME.BackgroundTiles) {
            this.backgroundTiles.tiles = layer.data;
            this.backgroundTiles.widthInTiles = layer.width;
            this.backgroundTiles.heightInTiles = layer.height;
        } else if(layer.name === MAP_LAYER_NAME.CollisionTiles) {
            this.collisionTiles.tiles = layer.data;
            this.collisionTiles.widthInTiles = layer.width;
            this.collisionTiles.heightInTiles = layer.height;
        } else if(layer.name === MAP_LAYER_NAME.EnvironmentColliders) {
            for(let collider of layer.objects) {
                
                this.colliders.push(new EnvironmentCollider(collider.polygon, {x:collider.x, y:collider.y}, collider.direction));
            }
        } else if(layer.name === MAP_LAYER_NAME.Entities) {
            this.entities = layer.objects;
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

    this.loadMap = function(name) {
        switch(name) {
            case MAP_NAME.Bar:
                this.currentMap = loadBar();
                break;
            case MAP_NAME.Highway:
                this.currentMap = loadHighway();
                break;
            case MAP_NAME.Boss:
                this.currentMap = loadBoss();
                break;
            default:
                this.currentMap = loadTestMap();
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
                this.currentMap = loadBoss();
                break;
            case MAP_NAME.Boss:
                this.currentMap = null;
                break;
            default:
                this.currentMap = loadBar();
                break;
        }
    };
    
    const loadBar = function() {
        const layers = TileMaps.bar.layers;
        return new Map(layers);
    };
    
    const loadHighway = function() {
        const layers = TileMaps.highway.layers;
        return new Map(layers);
    };
    
    const loadBoss = function() {
        const layers = TileMaps.boss.layers;
        return new Map(layers);
    };
    
    const loadTestMap = function() {
        const layers = TileMaps.testMap.layers;
        return new Map(layers);
    };
}