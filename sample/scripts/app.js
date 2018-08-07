'use strict';

js.settings({
    minify: true,
    debug: false,
    requireAuth: true,
    app: {
        title: 'Test'
    },
    meta: {
        dir: './test/'
    },
    style: {
        length: 1,
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        }
    }
});

// Set server provider.
js.server({

    // Auto login.
    autoLogin: function() {
        js.loadPage('test', { first: true });
    }

});

js.start();
