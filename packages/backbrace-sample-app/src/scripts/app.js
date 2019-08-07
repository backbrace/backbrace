'use strict';

(function(window, $) {

    // Setup the app.
    backbrace.settings({
        app: {
            title: 'Backbrace - Samples'
        },
        style: {
            css: './styles/samples.css',
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
        window.navigator.serviceWorker.register((!backbrace.globals.DEVMODE ? './backbrace' : '') + '/service-worker.js' + (backbrace.settings().debug ? '?debug=true' : ''))
            .then(function(reg) {
                backbrace.serviceWorker(reg);
            });

    backbrace.ready(function() {
        backbrace.loadPage('page/dashboard');
    });

    // Start the app!
    backbrace.start();

})(backbrace.window(), backbrace.jquery());
