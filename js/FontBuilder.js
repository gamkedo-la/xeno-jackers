//FontBuilder.js
function FontBuilder(fontSheet, charWidth, charHeight) {
    this.drawString = function(context, x, y, text, scale = 1) {
        let thisX = x;
        for(let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const position = getXYForChar(char);
            context.drawImage(fontSheet, position.x, position.y, charWidth, charHeight, thisX, y, scale * charWidth, scale * charHeight);
            thisX += (scale * charWidth);
        }
    };

    this.getWidthOfText = function(text, scale) {
        return text.length * scale * charWidth;
    };

    this.getHeightOfText = function(scale) {
        return scale * charHeight;
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
    }
}