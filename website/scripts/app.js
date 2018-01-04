'use strict';

jumpstart(function(scope) {

    var $app = scope.app,
        $code = scope.code;

    $app.ready(function() {
        $code.thread(function() {
            return $app.component().loadMenu().loadPage('test');
        });
    });

    $app.start();
});