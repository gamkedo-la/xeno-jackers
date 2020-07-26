// simple mobile controls that emulate keyboard events

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

var fakeEvent = {
    key:'SPACE',
    keyCode:0,
    preventDefault:function(){;},
}

// emulate keyboard events

function touchDOWN(key) {
    fakeEvent.keyCode=key;
    keyPress(fakeEvent); 
}

function touchUP(key) {
    fakeEvent.keyCode=key;
    keyRelease(fakeEvent); 
}

function initializeMobileControls() {
    var mobileControlsDIV = document.getElementById('mobileControls');
    if (mobileControlsDIV) mobileControlsDIV.style.display = 'block';

}

function hideMobileControls() {
    var mobileControlsDIV = document.getElementById('mobileControls');
    if (mobileControlsDIV) mobileControlsDIV.style.display = 'none';
}
