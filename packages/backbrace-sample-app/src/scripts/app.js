'use strict';

(function(window, $) {

    // Setup the app.
    backbrace.settings({
        app: {
            title: 'Test'
        },
        style: {
            images: {
                logo: './images/logo-landscape.png',
                blocker: './images/logo-portrait-dark.png'
            },
            colors: {
                bgprimary: '#34495e'
            }
        }
    });

    // Setup dev mode.
    if (backbrace.globals.DEVMODE) {
        backbrace.settings({
            minify: false,
            debug: true
        });
    } else {
        backbrace.publicPath('./backbrace/');
        backbrace.settings({
            dir: {
                tern: './backbrace/json/'
            }
        });
    }

    // Register the service worker.
    if ('serviceWorker' in window.navigator)
        window.navigator.serviceWorker.register('/service-worker.js' + (backbrace.settings().debug ? '?debug=true' : ''))
            .then(function(reg) {
                backbrace.serviceWorker(reg);
            });

    backbrace.ready(function() {
        backbrace.loadPage('page/test');
    });

    // Start the app!
    backbrace.start();

})(backbrace.window(), backbrace.jquery());
