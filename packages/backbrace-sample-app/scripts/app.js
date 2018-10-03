'use strict';

// Setup the app.
bb.settings({
    minify: false,
    debug: true,
    packages: './packages',
    app: {
        title: 'Test'
    },
    style: {
        images: {
            logo: './images/logo-light.png',
            blocker: './images/512x512-icon.png'
        },
        font: {
            url: 'https://labs.zoomapps.com.au/JumpstartCDN/fonts/googlesans/googlesans.css',
            family: 'Google Sans'
        }
    }
});

// Register the service worker.
if ('serviceWorker' in window.navigator)
    window.navigator.serviceWorker.register('service-worker.js' + (bb.settings().debug ? '?debug=true' : ''))
        .then(function(reg) {
            bb.serviceWorker(reg);
        });

bb.ready(function() {
    bb.message('Ready!');
});

// Start the app!
bb.start();
