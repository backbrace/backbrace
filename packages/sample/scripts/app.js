'use strict';

// Setup the app.
js.settings({
    minify: false,
    debug: true,
    packages: './packages',
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

// Register the service worker.
if ('serviceWorker' in window.navigator)
    window.navigator.serviceWorker.register('service-worker.js' + (js.settings().debug ? '?debug=true' : ''))
        .then(function(reg) {
            js.serviceWorker(reg);
        });

js.ready(function() {
    js.message('Ready!');
});

// Start the app!
js.start();
