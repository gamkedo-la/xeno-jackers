//BrightImageBuilder
function BrightImageBuilder() {
    const BRIGHT_FACTOR = 155;

    this.imageForImage = function(image) {
        try {
            const thisCanvas = document.createElement("canvas");
            thisCanvas.width = image.width;
            thisCanvas.height = image.height;
            const thisContext = thisCanvas.getContext("2d");
            thisContext.drawImage(image, 0, 0);
            const data = thisContext.getImageData(0, 0, thisCanvas.width, thisCanvas.height);
            const processedData = processData(data);
            thisContext.putImageData(processedData, 0, 0);
            return thisCanvas;
        } catch (error) {
            return image;
        }
    };

    function processData(imageData) {
        const data = imageData.data;
        for(let i = 0; i <  data.length; i+=4) {
            if(data[i + 3] > 0.01) {
                data[i + 0] = clamp(data[i + 0] + BRIGHT_FACTOR, 0, 255);
                data[i + 1] = clamp(data[i + 1] + BRIGHT_FACTOR, 0, 255);
                data[i + 2] = clamp(data[i + 2] + BRIGHT_FACTOR, 0, 255);
            }
        }
        imageData.data = data;
        return imageData;
    };

    function clamp(value, low, high) {
        result = value;
        if(result < low) {
            result = low;
        } else if(result > high) {
            result = high;
        }
    
        return result;
    };
}