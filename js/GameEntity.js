//GameEntity.js
const EntityType = {
    //Characters
    Player:"player",
    EnemyBiker:"enemyBiker",
    EnemyBugBiker:"enemyBugBiker",

    //Weapons
    Chain:"chain",
    Wheel:"wheel",
    Handlebar:"handlebar",
    EnemyBullet:"enemyBullet",

    //Powerups
    Engine:"engine",

    //Pickups
    Health:"health",

    //Environment
    Ground:"ground",
    Crate:"crate",
    Barrel:"barrel",
    Table:"table",

};

function isEnemy(entity) {
    switch(entity.type) {
        case EntityType.EnemyBiker:
        case EntityType.EnemyBugBiker:
            return true;
        default:
            return false;
    }
}

function isPlayerWeapon(entity) {
    switch(entity.type) {
        case EntityType.Chain:
        case EntityType.Wheel:
        case EntityType.Handlebar:
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

function isPowerup(entity) {
    switch(entity.type) {
        case EntityType.Engine:
            return true;
        default:
            return false;
    }
}

function isPickup(entity) {
    switch(entity.type) {
        case EntityType.Health:
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