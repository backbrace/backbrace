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
            logo: './images/logo-landscape.png',
            blocker: './images/logo-portrait-dark.png'
        },
        font: {
            url: './dist/roboto/css/roboto/roboto-fontface.css'
        },
        colors: {
            primary: '#34495e'
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
