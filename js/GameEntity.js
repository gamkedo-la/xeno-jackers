//GameEntity.js
const EntityType = {
    //Characters
    Player:"player",
    EnemyBiker:"enemyBiker",
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

    //Pickups
    Health:"health",
    ChainPickup:"chainPickup",
    WheelPickup:"wheelPickup",
    HandlebarPickup:"handlebarPickup",
    EnginePickup:"enginePickup",

    //Environment
    Ground:"ground",
    Wall:"wall",
    Crate:"crate",
    Barrel:"barrel",
    Table:"table",

};

function isEnemy(entity) {
    switch(entity.type) {
        case EntityType.EnemyBiker:
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
        case EntityType.Crate:
        case EntityType.Barrel:
        case EntityType.Table:
            return true;
        default:
            return false;
    }
}