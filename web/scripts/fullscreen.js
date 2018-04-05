(function(){
    // Ported in part
    // Source https://github.com/rafrex/fscreen/blob/master/src/index.js
    const key = {
        fullscreenEnabled: 0,
        fullscreenElement: 1,
        requestFullscreen: 2,
        exitFullscreen: 3,
        fullscreenchange: 4,
        fullscreenerror: 5,
    };

    const webkit = [
        'webkitFullscreenEnabled',
        'webkitFullscreenElement',
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
    ];

    const moz = [
        'mozFullScreenEnabled',
        'mozFullScreenElement',
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozfullscreenchange',
        'mozfullscreenerror',
    ];

    const ms = [
        'msFullscreenEnabled',
        'msFullscreenElement',
        'msRequestFullscreen',
        'msExitFullscreen',
        'MSFullscreenChange',
        'MSFullscreenError',
    ];

    const vendor = (
        ('fullscreenEnabled' in document && Object.keys(key)) ||
        (webkit[0] in document && webkit) ||
        (moz[0] in document && moz) ||
        (ms[0] in document && ms) ||
        []
    );

    const requestFullscreen = function requestFullscreen( element ){
        return element[ vendor[ key.requestFullscreen ] ]();
    };

    const getFullScreenElement = function getFullScreenElement() {
        return document[ vendor[ key.fullscreenElement ] ];
    };

    const exitFullscreen = function exitFullscreen() {
        return document[ vendor[ key.exitFullscreen ] ].bind( document )();
    };

    const toggleFullScreen = function toggleFullScreen() {
        console.log( getFullScreenElement()  );
        if ( getFullScreenElement() == null ) {
            requestFullscreen( document.documentElement );
        } else {
            exitFullscreen();
        }
    }

    document.addEventListener( 'keydown', ( event ) => {
        if ( event.keyCode == 13 ) {
            toggleFullScreen();
        }
    }, false );
})();
