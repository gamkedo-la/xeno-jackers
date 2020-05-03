//FontBuilder.js
function FontBuilder(fontSheet, charWidth, charHeight) {
    this.drawString = function(context, x, y, text, scale = 1) {
        let thisX = x;
        for(let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const position = getXYForChar(char);
            context.drawImage(fontSheet, position.x, position.y, charWidth, charHeight, thisX, y, scale * charWidth, scale * charHeight);
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
                return {x:5, y:0};
            case 'C':
            case 'c':
                return {x:10, y:0};
            case 'D':
            case 'd':
                return {x:15, y:0};
            case 'E':
            case 'e':
                return {x:20, y:0};
            case 'F':
            case 'f':
                return {x:25, y:0};
            case 'G':
            case 'g':
                return {x:30, y:0};
            case 'H':
            case 'h':
                return {x:35, y:0};
            case 'I':
            case "i":
                return {x:40, y:0};
            case 'J':
            case 'j':
                return {x:45, y:0};
            case 'K':
            case 'k':
                return {x:50, y:0};
            case 'L':
            case 'l':
                return {x:55, y:0};
            case 'M':
            case 'm':
                return {x:60, y:0};
            case 'N':
            case 'n':
                return {x:0, y:7};
            case 'O':
            case 'o':
                return {x:5, y:7};
            case 'P':
            case 'p':
                return {x:10, y:7};
            case 'Q':
            case 'q':
                return {x:15, y:7};
            case 'R':
            case 'r':
                return {x:20, y:7};
            case 'S':
            case 's':
                return {x:25, y:7};
            case 'T':
            case 't':
                return {x:30, y:7};
            case 'U':
            case 'u':
                return {x:35, y:7};
            case 'V':
            case 'v':
                return {x:40, y:7};
            case 'W':
            case 'w':
                return {x:45, y:7};
            case 'X':
            case 'x':
                return {x:50, y:7};
            case 'Y':
            case 'y':
                return {x:55, y:7};
            case 'Z':
            case 'z':
                return {x:60, y:7};
            case '1':
                return {x:0, y:14};
            case '2':
                return {x:5, y:14};
            case '3':
                return {x:10, y:14};
            case '4':
                return {x:15, y:14};
            case '5':
                return {x:20, y:14};
            case '6':
                return {x:25, y:14};
            case '7':
                return {x:30, y:14};
            case '8':
                return {x:35, y:14};
            case '9':
                return {x:40, y:14};
            case '0':
                return {x:45, y:14};
            case '.':
                return {x:50, y:14};
            case ',':
                return {x:55, y:14};
            case '?':
                return {x:60, y:14};
            case '!':
                return {x:0, y:21};
            case '@':
                return {x:5, y:21};
            case '#':
                return {x:10, y:21};
            case '$':
                return {x:15, y:21};
            case '%':
                return {x:20, y:21};
            case '^':
                return {x:25, y:21};
            case '&':
                return {x:30, y:21};
            case '*':
                return {x:35, y:21};
            case '(':
                return {x:40, y:21};
            case ')':
                return {x:45, y:21};
            case '-':
                return {x:50, y:21};
            case '+':
                return {x:55, y:21};
            case '=':
                return {x:60, y:21};
        }
    }
}