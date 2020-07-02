// simple mobile controls

// at first I was going to do it via
// document.addEventListener('touchstart', onTouchStart);
// document.addEventListener('touchend', onTouchEnd);
// document.addEventListener('touchcancel', onTouchCancel);
// but then we have to deal with:
// x,y scaling
// mulitouch ID tracking to know when we let go of which finger 
// that sounds tricky

// KISS idea: use <a> tags!
// advantages:
// widest browser support
// no scaling or finger IDs
// and we don't bother with fancy callbacks or event managers

// just check these globals anytime! cheap but effective! =)
var touchingUP = false;
var touchingDOWN = false;
var touchingLEFT = false;
var touchingRIGHT = false;
var touchingATTACK1 = false;
var touchingATTACK2 = false;

function initializeMobileControls() {

    console.log("Mobile Support is ENABLED. Displaying touch controls...");

}

/*
function onTouchStart(evt) {
    console.log("TOUCH START");
    evt.preventDefault();
}

function onTouchEnd(evt) {
    console.log("TOUCH END");
    evt.preventDefault();
}

function onTouchCancel(evt) {
    console.log("TOUCH CANCEL");
    evt.preventDefault();
}
*/
