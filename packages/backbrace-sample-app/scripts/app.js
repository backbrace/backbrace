'use strict';

// Setup the app.
bb.settings({
    minify: false,
    debug: true,
    packages: './dist',
    app: {
        title: 'Test'
    },
    style: {
        images: {
            logo: './images/logo-light.png',
            blocker: './images/512x512-icon.png'
        },
        font: {
            url: './dist/roboto/css/roboto/roboto-fontface.css'
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
