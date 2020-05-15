const FONT = {
    White:null,
    LightGrey:null,
    DarkGrey:null,
    Black:null,
    Stroked:null,
    SmallScore:null,
    LargeScore:null
};

//FontBuilder.js
function FontBuilder() {
    FONT.White = fontSheet,
    FONT.LightGrey = fontSheet2,
    FONT.DarkGrey = fontSheet3,
    FONT.Black = fontSheet4,
    FONT.Stroked = fontSheetStroke,
    FONT.SmallScore = fontSheetScore,
    FONT.LargeScore = fontSheetScore

    this.drawString = function(context, x, y, text, font = FONT.White, scale = 1) {
        let thisX = x;
        for(let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const fontData = getPositionAndSizeForChar(char, font);
            
            context.drawImage(
                font, 
                fontData.position.x, fontData.position.y, 
                fontData.width, fontData.height, 
                thisX, y, 
                scale * fontData.width, scale * fontData.height
            );

            thisX += (scale * fontData.width);
        }
    };

    this.getWidthOfText = function(text, scale, font = FONT.White) {
        const fontData = getPositionAndSizeForChar("0", font);
        return text.length * scale * fontData.width;
    };

    this.getHeightOfText = function(scale, font = FONT.White) {
        const fontData = getPositionAndSizeForChar("0", font);
        return scale * fontData.height;
    };

    const getPositionAndSizeForChar = function(char, font = FONT.White) {
        switch(font) {
            case FONT.White:
            case FONT.LightGrey:
            case FONT.DarkGrey:
            case FONT.Black:
                return {position: getXYForChar(char), width:7, height:9};
            case FONT.Stroked:
                return {position: getStrokedXYForChar(char), width:9, height:11};
            case FONT.SmallScore:
                return {position: getSmallScoreXYForChar(char), width:8, height:10};
            case FONT.LargeScore:
                return {position: getLargeScoreXYForChar(char), width:10, height:14};
        }
    };

    const getXYForChar = function(char) {
        switch(char) {
            case 'A':
            case 'a':
                return {x:0, y:0};
            case 'B':
            case 'b':
                return {x:7, y:0};
            case 'C':
            case 'c':
                return {x:14, y:0};
            case 'D':
            case 'd':
                return {x:21, y:0};
            case 'E':
            case 'e':
                return {x:28, y:0};
            case 'F':
            case 'f':
                return {x:35, y:0};
            case 'G':
            case 'g':
                return {x:42, y:0};
            case 'H':
            case 'h':
                return {x:49, y:0};
            case 'I':
            case "i":
                return {x:56, y:0};
            case 'J':
            case 'j':
                return {x:63, y:0};
            case 'K':
            case 'k':
                return {x:70, y:0};
            case 'L':
            case 'l':
                return {x:77, y:0};
            case 'M':
            case 'm':
                return {x:84, y:0};
            case 'N':
            case 'n':
                return {x:0, y:9};
            case 'O':
            case 'o':
                return {x:7, y:9};
            case 'P':
            case 'p':
                return {x:14, y:9};
            case 'Q':
            case 'q':
                return {x:21, y:9};
            case 'R':
            case 'r':
                return {x:28, y:9};
            case 'S':
            case 's':
                return {x:35, y:9};
            case 'T':
            case 't':
                return {x:42, y:9};
            case 'U':
            case 'u':
                return {x:49, y:9};
            case 'V':
            case 'v':
                return {x:56, y:9};
            case 'W':
            case 'w':
                return {x:63, y:9};
            case 'X':
            case 'x':
                return {x:70, y:9};
            case 'Y':
            case 'y':
                return {x:77, y:9};
            case 'Z':
            case 'z':
                return {x:84, y:9};
            case '1':
                return {x:0, y:18};
            case '2':
                return {x:7, y:18};
            case '3':
                return {x:14, y:18};
            case '4':
                return {x:21, y:18};
            case '5':
                return {x:28, y:18};
            case '6':
                return {x:35, y:18};
            case '7':
                return {x:42, y:18};
            case '8':
                return {x:49, y:18};
            case '9':
                return {x:56, y:18};
            case '0':
                return {x:63, y:18};
            case '.':
                return {x:70, y:18};
            case ',':
                return {x:77, y:18};
            case '?':
                return {x:84, y:18};
            case '!':
                return {x:0, y:17};
            case '@':
                return {x:7, y:17};
            case '#':
                return {x:14, y:17};
            case '$':
                return {x:21, y:17};
            case '%':
                return {x:28, y:17};
            case '^':
                return {x:35, y:17};
            case '&':
                return {x:42, y:17};
            case '*':
                return {x:49, y:17};
            case '(':
                return {x:56, y:17};
            case ')':
                return {x:63, y:17};
            case '-':
                return {x:70, y:17};
            case '+':
                return {x:77, y:17};
            case '=':
                return {x:84, y:17};
        }
    };

    const getStrokedXYForChar = function(char) {
        switch(char) {
            case 'A':
            case 'a':
                return {x:0, y:0};
            case 'B':
            case 'b':
                return {x:9, y:0};
            case 'C':
            case 'c':
                return {x:18, y:0};
            case 'D':
            case 'd':
                return {x:27, y:0};
            case 'E':
            case 'e':
                return {x:36, y:0};
            case 'F':
            case 'f':
                return {x:45, y:0};
            case 'G':
            case 'g':
                return {x:54, y:0};
            case 'H':
            case 'h':
                return {x:63, y:0};
            case 'I':
            case "i":
                return {x:72, y:0};
            case 'J':
            case 'j':
                return {x:81, y:0};
            case 'K':
            case 'k':
                return {x:90, y:0};
            case 'L':
            case 'l':
                return {x:99, y:0};
            case 'M':
            case 'm':
                return {x:108, y:0};
            case 'N':
            case 'n':
                return {x:0, y:11};
            case 'O':
            case 'o':
                return {x:9, y:11};
            case 'P':
            case 'p':
                return {x:18, y:11};
            case 'Q':
            case 'q':
                return {x:27, y:11};
            case 'R':
            case 'r':
                return {x:36, y:11};
            case 'S':
            case 's':
                return {x:45, y:11};
            case 'T':
            case 't':
                return {x:54, y:11};
            case 'U':
            case 'u':
                return {x:63, y:11};
            case 'V':
            case 'v':
                return {x:72, y:11};
            case 'W':
            case 'w':
                return {x:81, y:11};
            case 'X':
            case 'x':
                return {x:90, y:11};
            case 'Y':
            case 'y':
                return {x:99, y:11};
            case 'Z':
            case 'z':
                return {x:108, y:11};
            case '1':
                return {x:0, y:22};
            case '2':
                return {x:9, y:22};
            case '3':
                return {x:18, y:22};
            case '4':
                return {x:27, y:22};
            case '5':
                return {x:36, y:22};
            case '6':
                return {x:45, y:22};
            case '7':
                return {x:54, y:22};
            case '8':
                return {x:63, y:22};
            case '9':
                return {x:72, y:22};
            case '0':
                return {x:81, y:22};
            case '.':
                return {x:90, y:22};
            case ',':
                return {x:99, y:22};
            case '?':
                return {x:108, y:22};
            case '!':
                return {x:0, y:33};
            case '@':
                return {x:9, y:33};
            case '#':
                return {x:18, y:33};
            case '$':
                return {x:27, y:33};
            case '%':
                return {x:36, y:33};
            case '^':
                return {x:45, y:33};
            case '&':
                return {x:54, y:33};
            case '*':
                return {x:63, y:33};
            case '(':
                return {x:72, y:33};
            case ')':
                return {x:81, y:33};
            case '-':
                return {x:90, y:33};
            case '+':
                return {x:99, y:33};
            case '=':
                return {x:108, y:33};
        }
    };

    const getSmallScoreXYForChar = function(char) {
        switch(char) {
            case '1':
                return {x:0, y:0};
            case '2':
                return {x:8, y:0};
            case '3':
                return {x:18, y:0};
            case '4':
                return {x:27, y:0};
            case '5':
                return {x:36, y:0};
            case '6':
                return {x:45, y:0};
            case '7':
                return {x:54, y:0};
            case '8':
                return {x:63, y:0};
            case '9':
                return {x:72, y:0};
            case '0':
                return {x:81, y:0};
        }
    };

    const getLargeScoreXYForChar = function(char) {
        switch(char) {
            case '1':
                return {x:0, y:10};
            case '2':
                return {x:10, y:10};
            case '3':
                return {x:20, y:10};
            case '4':
                return {x:30, y:10};
            case '5':
                return {x:40, y:10};
            case '6':
                return {x:50, y:10};
            case '7':
                return {x:60, y:10};
            case '8':
                return {x:70, y:10};
            case '9':
                return {x:80, y:10};
            case '0':
                return {x:90, y:10};
        }
    };
}