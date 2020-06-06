//MapRenderer.js
function MapRenderer(canvas, context, tileSheet, tile_ImageWidth = 8, tile_ImageHeight = 8, tile_RenderWidth = 8, tile_RenderHeight = 8) {
    let renderedTilesPerRow = Math.ceil(canvas.width / tile_RenderWidth) + 1;
    let renderedRowCount = Math.ceil(canvas.height / tile_RenderHeight);
    const imagesPerRow = Math.round(tileSheet.width / tile_ImageWidth);

    let tileManager = new AnimatedTileManager();

    this.update = function(deltaTime) {
        tileManager.update(deltaTime);
    };

    this.drawSkybox = function(context, skybox) {
        const skyboxImage = getSkyboxForName(skybox.image);
        if(skyboxImage !== null) {
            context.drawImage(skybox.image, skybox.x, skybox.y);
        }
    };

    this.drawTileLayer = function(tiles, mapWidthInTiles) {
        let leftEdge = canvas.center.x - canvas.width / 2;
        if(leftEdge < 0) leftEdge = 0;
        let topEdge = canvas.center.y - canvas.height / 2;
        if(topEdge < 0) topEdge = 0;

        for(let j = 0; j < renderedRowCount; j++) {
            const index = getIndexForPixelPos(leftEdge, topEdge + j * tile_RenderHeight, mapWidthInTiles);
            renderRowAtIndex(tiles, index, mapWidthInTiles);
        }
    };

    const getIndexForPixelPos = function(x, y, mapWidthInTiles) {
        const tileX = Math.floor(x / tile_RenderWidth);
        const tileY = Math.floor(y / tile_RenderHeight);

        return tileY * mapWidthInTiles + tileX;
    };

    const renderRowAtIndex = function(tiles, index, mapWidthInTiles) {
        let renderIndex = index - 1;
        for(let i = 0; i < renderedTilesPerRow; i++) {
            const renderPos = getPixelPosForIndex(++renderIndex, mapWidthInTiles);
            if(tiles[renderIndex] === 0) continue;
            const texturePos = getTexturePosForGID(tiles[renderIndex]);
            context.drawImage(
                tileSheet, 
                texturePos.x, texturePos.y, 
                tile_ImageWidth, tile_ImageHeight,
                renderPos.x, renderPos.y,
                tile_RenderWidth, tile_RenderHeight);
        }
    };

    const getTexturePosForGID = function(GID) {
        GID = tileManager.nextGIDForGID(GID);

        const y = Math.floor(GID / imagesPerRow);
        const x = GID % imagesPerRow;
        return {x:x * tile_ImageWidth, y:y * tile_ImageHeight};
    };

    const getPixelPosForIndex = function(index, mapWidthInTiles) {
        const tileX = index % mapWidthInTiles;
        const tileY = Math.floor(index / mapWidthInTiles);

        let xPos = tileX * tile_RenderWidth;
        let yPos = tileY * tile_RenderHeight;

        const canvasLeft = canvas.center.x - canvas.width / 2;
        const canvasTop = canvas.center.y - canvas.height / 2;

        xPos = xPos - canvasLeft;
        yPos = yPos - canvasTop;

        return {x:xPos, y:yPos};
    };
}