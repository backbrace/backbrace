'use strict';

Jumpstart.settings({
    minify: false,
    debug: true,
    style: {
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        }
    }
});

Jumpstart.ready(function(){
    Jumpstart.loadPage('test');
});

Jumpstart.start();
