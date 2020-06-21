//AnimatedTileManager.js
function AnimatedTileManager() {
    const tiles = {};
    let unanimated = new Set();
    let elapsedTime = 0;

    this.update = function(deltaTime) {
        if(elapsedTime + deltaTime > Number.MAX_VALUE) {
            elapsedTime -= Number.MAX_VALUE;
        }

        elapsedTime += deltaTime;
    };

    this.stopAnimating = function(tilesToStop) {
        for(let tile of tilesToStop) {
            unanimated.add(tile);
        }
    };

    this.nextGIDForGID = function(GID) {
        GID--;//subtract 1 to align Tiled 1-based numbering to our 0-based numbering
        const GIDData = tiles[GID];
        if(GIDData === undefined) return GID;
        if(unanimated.has(GID)) return GID;

        GIDData.currentFrame = (Math.floor(elapsedTime / GIDData.frameTime) % GIDData.GIDs.length);

        return GIDData.GIDs[GIDData.currentFrame];
    };

    tiles[268] = {GIDs:[268, 270], frameTime:128, currentFrame:0};
    tiles[269] = {GIDs:[269, 271], frameTime:128, currentFrame:0};
    tiles[332] = {GIDs:[332, 334], frameTime:128, currentFrame:0};
    tiles[333] = {GIDs:[333, 335], frameTime:128, currentFrame:0};
    tiles[458] = {GIDs:[458, 590, 718, 846, 844, 1102], frameTime:128, currentFrame:0};
    tiles[459] = {GIDs:[459, 591, 719, 847, 845, 1103], frameTime:128, currentFrame:0};
    tiles[150] = {GIDs:[150, 152, 154, 152], frameTime:256, currentFrame:0};
    tiles[151] = {GIDs:[151, 153, 155, 153], frameTime:256, currentFrame:0};
    tiles[214] = {GIDs:[214, 216, 218, 216], frameTime:256, currentFrame:0};
    tiles[215] = {GIDs:[215, 217, 219, 217], frameTime:256, currentFrame:0};
}