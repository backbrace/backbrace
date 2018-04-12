'use strict';

js.settings({
    minify: false,
    debug: true,
    style: {
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        }
    }
});

js.ready(function(){
    js.loadPage('test');
});

js.start();
