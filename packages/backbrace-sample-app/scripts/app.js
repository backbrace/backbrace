'use strict';

// Setup the app.
backbrace.settings({
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
    window.navigator.serviceWorker.register('service-worker.js' + (backbrace.settings().debug ? '?debug=true' : ''))
        .then(function(reg) {
            backbrace.serviceWorker(reg);
        });

backbrace.ready(function() {
    backbrace.message('Ready!');
});

// Start the app!
backbrace.start();
