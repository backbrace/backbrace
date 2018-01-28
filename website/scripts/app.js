'use strict';

jumpstart(function(scope) {

    var $app = scope.app,
        $code = scope.code;

    $app.ready(function() {
        $code.thread(function() {
            return $app.component().loadMenu().loadPage('test');
        });
    });

    var settings = {
        minify: false,
        style: {
            images: {
                logo: 'https://cdn.jumpstartjs.org/images/logo-light.png',
                blocker: 'https://cdn.jumpstartjs.org/images/logo-portrait.png'
            }
        }
    };
    $app.start(settings);
});