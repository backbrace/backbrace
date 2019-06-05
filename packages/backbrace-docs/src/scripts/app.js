'use strict';

(function(window, $) {

    // Setup the app.
    backbrace.settings({
        windowMode: false,
        app: {
            title: 'Backbrace Docs'
        },
        style: {
            css: '/styles/website.css',
            images: {
                logo: '/images/logo-landscape.png',
                blocker: '/images/logo-portrait-dark.png'
            },
            colors: {
                bgprimary: '#34495e',
                bgbody: '#FFF',
                textbody: 'rgba(0, 0, 0, 0.87)'
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

    // Setup routes.
    backbrace.route(
        { path: '/', page: 'page/guide' },
        { path: ':name', page: 'page/guide' },
        { path: ':parent/:name', page: 'page/guide' },
        { path: 'api', page: 'page/apihome' },
        { path: 'api/:module', page: 'page/api' }
    );

    backbrace.ready(function() {

        $('.navbar-brand').attr('route', '/');

        //$('<div class="header-link"><a route="api">API</a></div>')
        //   .appendTo($('.navbar-inner'));

    });

    // Start the app!
    backbrace.start();

})(backbrace.window(), backbrace.jquery());
