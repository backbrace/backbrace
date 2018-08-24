'use strict';

js.settings({
    minify: false,
    debug: true,
    app: {
        title: 'Test'
    },
    style: {
        images: {
            logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
            blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
        },
        font: {
            url: 'https://labs.zoomapps.com.au/JumpstartCDN/fonts/googlesans/googlesans.css',
            family: 'Google Sans'
        }
    }
});

if ('serviceWorker' in window.navigator)
    window.navigator.serviceWorker.register('service-worker.js' + (js.settings().debug ? '?debug=true' : ''))
        .then(function(reg) {
            js.serviceWorker(reg);
        });

// Set server provider.
js.ready(function() {
    js.loadPage('pages/employee list', { first: true });
    js.loadPage('pages/employee card');
});

js.start();
