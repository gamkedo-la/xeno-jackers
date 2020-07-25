//GameEntity.js
const EntityType = {
    //Characters
    Player:"player",
    EnemyBiker:"enemyBiker",
    EnemyBiker2:"enemyBiker2",
    EnemyCrawler:"enemyCrawler",
    EnemyChunkyCrawler:"chunkyEnemyCrawler",
    EnemyFlyer:"flyingEnemy",
    EnemyAlienGuard:"enemyAlienGuard",
    WallOrb:"wallOrb",
    EnemyMech:"enemyMech",
    FinalBoss:"finalBoss",

    //Tools
    Chain:"chain",
    Wheel:"wheel",
    Handlebar:"handlebar",
    Engine:"engine",

    //EnemyTools
    EnemyBullet:"enemyBullet",
    EnemyFist:"enemyFist",
    FlyingFist:"flyingFist",
    FlyingSpit:"flyingSpit",

    //Pickups
    Health:"health",
    ChainPickup:"chainPickup",
    WheelPickup:"wheelPickup",
    HandlebarPickup:"handlebarPickup",
    EnginePickup:"enginePickup",

    //Environment
    Ground:"ground",
    Ceiling:"ceiling",
    Wall:"wall",
    Crate:"crate",
    Barrel:"barrel",
    Table:"table",
    Truck:"truck",
    Deadzone:"deadzone",
    Roadzone:"roadzone",
    LevelExit:"levelExit",
    WallBarrier:"wallBarrier",
    JukeBox: "jukeBox",

    //Destructible
    Lamp:"lamp",
    JukeBox: "jukebox"
};

function isEnemy(entity) {
    switch(entity.type) {
        case EntityType.EnemyBiker:
        case EntityType.EnemyBiker2:
        case EntityType.EnemyCrawler:
        case EntityType.EnemyChunkyCrawler:
        case EntityType.EnemyFlyer:
        case EntityType.EnemyAlienGuard:
        case EntityType.EnemyMech:
        case EntityType.WallOrb:
            return true;
        default:
            return false;
    }
}

function isPlayerTool(entity) {
    switch(entity.type) {
        case EntityType.Chain:
        case EntityType.Wheel:
        case EntityType.Handlebar:
        case EntityType.Engine:
            return true;
        default:
            return false;
    }
}

function isEnemyWeapon(entity) {
    switch(entity.type) {
        case EntityType.EnemyBullet:
        case EntityType.EnemyFist:
        case EntityType.FlyingFist:
        case EntityType.FlyingSpit:
            return true;
        default:
            return false;
    }
}

function isPickup(entity) {
    switch(entity.type) {
        case EntityType.Health:
        case EntityType.ChainPickup:
        case EntityType.WheelPickup:
        case EntityType.HandlebarPickup:
        case EntityType.EnginePickup:
            return true;
        default:
            return false;
    }
}

function isEnvironment(entity) {
    switch(entity.type) {
        case EntityType.Ground:
        case EntityType.Wall:
        case EntityType.Crate:
        case EntityType.Barrel:
        case EntityType.Table:
        case EntityType.Truck:
        case EntityType.Deadzone:
        case EntityType.Roadzone:
        case EntityType.LevelExit:
        case EntityType.WallBarrier:
            return true;
        default:
            return false;
    }
}

function isEnvironmentObject(entity) {
    switch(entity.type) {
        case EntityType.Lamp:
        case EntityType.JukeBox:
            return true;
        default:
            return false;
    }
}