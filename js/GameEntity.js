//GameEntity.js
const EntityType = {
    //Characters
    Player:"player",
    EnemyBiker:"enemyBiker",
    EnemyBiker2:"enemyBiker2",
    EnemyCrawler:"enemyCrawler",
    EnemyAlienGuard:"enemyAlienGuard",
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
    Deadzone:"deadzone",
    Roadzone:"roadzone",
    LevelExit:"levelExit",

    //Destructible
    Lamp:"lamp"
};

function isEnemy(entity) {
    switch(entity.type) {
        case EntityType.EnemyBiker:
        case EntityType.EnemyBiker2:
        case EntityType.EnemyCrawler:
        case EntityType.EnemyAlienGuard:
        case EntityType.EnemyMech:
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
        case EntityType.Deadzone:
        case EntityType.Roadzone:
        case EntityType.LevelExit:
            return true;
        default:
            return false;
    }
}

function isEnvironmentObject(entity) {
    switch(entity.type) {
        case EntityType.Lamp:
            return true;
        default:
            return false;
    }
}