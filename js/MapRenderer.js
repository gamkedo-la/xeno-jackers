//MapRenderer.js
function MapRenderer(canvas, context, tileSheet, tile_ImageWidth = 8, tile_ImageHeight = 8, tile_RenderWidth = 8, tile_RenderHeight = 8) {
    let renderedTilesPerRow = Math.ceil(canvas.width / tile_RenderWidth);
    let renderedRowCount = Math.ceil(canvas.height / tile_RenderHeight);

    this.drawSkybox = function(context, skybox) {
        const skyboxImage = getSkyboxForName(skybox.image);
        if(skyboxImage !== null) {
            context.drawImage(skybox.image, skybox.x, skybox.y);
        }
    };

    this.drawTileLayer = function(tiles, mapWidthInTiles, pixelCenterX, pixelCenterY) {
        const firstTileIndex = getTileIndexForPixelPos(pixelCenterX - canvas.width/2, pixelCenterY - canvas.height/2) - 1;
        let currentTileIndex;
        for(let i = 0; i < renderedRowCount; i++) {
            currentTileIndex = firstTileIndex + (i * mapWidthInTiles);
            for(let j = 0; j < renderedTilesPerRow; j++) {
                currentTileIndex++;
                const imagePos = pixelPosForGID(tiles[currentTileIndex]);
                context.drawImage(
                    tileSheet, 
                    imagePos.x, imagePos.y, 
                    tile_ImageWidth, tile_ImageHeight, 
                    j * tile_RenderWidth, i * tile_RenderHeight, 
                    tile_RenderWidth, tile_RenderHeight
                );
            }
        }
    };

    const getTileIndexForPixelPos = function(pixelX, pixelY) {
        const tileX = pixelX % tile_RenderWidth;
        const tileY = pixelY % tile_RenderHeight;
        return ((tileY * renderedTilesPerRow) + tileX);
    };

    const pixelPosForGID = function(GID) {
        if(GID > 0) GID -= 1;

        const imagesPerRow = Math.round(tileSheet.width / tile_ImageWidth);
        const y = Math.floor(GID / imagesPerRow);
        const x = GID % imagesPerRow;
        return {x:x * tile_ImageWidth, y:y * tile_ImageHeight};
    };
}