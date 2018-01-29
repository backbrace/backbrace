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
                logo: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-light.png',
                blocker: 'https://labs.zoomapps.com.au/JumpstartCDN/images/logo-portrait.png'
            }
        }
    };
    $app.start(settings);
});