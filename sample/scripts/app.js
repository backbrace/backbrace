'use strict';

js.settings({
    minify: true,
    debug: true,
    app: {
        title: 'Test'
    },
    style: {
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        }
    }
});

if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('service-worker.js' + (js.settings().debug ? '?debug=true' : ''))
        .then(function(reg) {
            js.serviceWorker(reg);
        });

// Set server provider.
js.ready(function() {
    js.loadPage('pages/employee card', { first: true });
});

js.start();
