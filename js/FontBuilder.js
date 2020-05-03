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
                return {};
            case 'B':
            case 'b':
                return {};
            case 'C':
            case 'c':
                return {};
            case 'D':
            case 'd':
                return {};
            case 'E':
            case 'e':
                return {};
            case 'F':
            case 'f':
                return {};
            case 'G':
            case 'g':
                return {};
            case 'H':
            case 'h':
                return {};
            case 'I':
            case "i":
                return {};
            case 'J':
            case 'j':
                return {};
            case 'K':
            case 'k':
                return {};
            case 'L':
            case 'l':
                return {};
            case 'M':
            case 'm':
                return {};
            case 'N':
            case 'n':
                return {};
            case 'O':
            case 'o':
                return {};
            case 'P':
            case 'p':
                return {};
            case 'Q':
            case 'q':
                return {};
            case 'R':
            case 'r':
                return {};
            case 'S':
            case 's':
                return {};
            case 'T':
            case 't':
                return {};
            case 'U':
            case 'u':
                return {};
            case 'V':
            case 'v':
                return {};
            case 'W':
            case 'w':
                return {};
            case 'X':
            case 'x':
                return {};
            case 'Y':
            case 'y':
                return {};
            case 'Z':
            case 'z':
                return {};
            case '0':
                return {};
            case '1':
                return {};
            case '2':
                return {};
            case '3':
                return {};
            case '4':
                return {};
            case '5':
                return {};
            case '6':
                return {};
            case '7':
                return {};
            case '8':
                return {};
            case '9':
                return {};
        }
    }
}