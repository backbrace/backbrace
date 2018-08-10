'use strict';

if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('service-worker.js')
        .then(function(reg) {
            js.serviceWorker(reg);
        });

js.settings({
    minify: true,
    debug: false,
    app: {
        title: 'Test'
    },
    meta: {
        dir: './test/'
    },
    style: {
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        }
    }
});

// Set server provider.
js.ready(function() {
    js.loadPage('employee card', { first: true });
});

js.start();
