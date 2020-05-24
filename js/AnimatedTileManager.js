//AnimatedTileManager.js
function AnimatedTileManager() {
    const tiles = {};

    this.nextGIDForGID = function(GID, deltaTime) {
        GID--;//subtract 1 to align Tiled 1-based numbering to our 0-based numbering
        const GIDData = tiles[GID];
        if(GIDData === undefined) return GID;

        GIDData.elapsedTime += deltaTime;
        if(GIDData.elapsedTime >= GIDData.frameTime) {
            GIDData.elapsedTime -= GIDData.frameTime;
            GIDData.currentFrame++;
            if(GIDData.currentFrame >= GIDData.GIDs.length) {
                GIDData.currentFrame = 0;
            }
        }

        return GIDData.GIDs[GIDData.currentFrame];
    };

    tiles[458] = {GIDs:[458, 590, 718, 846, 844, 1102], frameTime:256, elapsedTime:0, currentFrame:0};
    tiles[459] = {GIDs:[459, 591, 719, 847, 845, 1103], frameTime:256, elapsedTime:0, currentFrame:0};
}