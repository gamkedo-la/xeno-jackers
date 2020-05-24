//AnimatedTileManager.js
function AnimatedTileManager() {
    const tiles = {};
    let elapsedTime = 0;

    this.update = function(deltaTime) {
        if(elapsedTime + deltaTime > Number.MAX_VALUE) {
            elapsedTime -= Number.MAX_VALUE;
        }

        elapsedTime += deltaTime;
    };

    this.nextGIDForGID = function(GID) {
        GID--;//subtract 1 to align Tiled 1-based numbering to our 0-based numbering
        const GIDData = tiles[GID];
        if(GIDData === undefined) return GID;

        GIDData.currentFrame = (Math.floor(elapsedTime / GIDData.frameTime) % GIDData.GIDs.length);

        return GIDData.GIDs[GIDData.currentFrame];
    };

    tiles[458] = {GIDs:[458, 590, 718, 846, 844, 1102], frameTime:128, currentFrame:0};
    tiles[459] = {GIDs:[459, 591, 719, 847, 845, 1103], frameTime:128, currentFrame:0};
}