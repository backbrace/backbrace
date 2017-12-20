'use strict';

jumpstart(function(scope) {

    var $app = scope.app,
        $code = scope.code,
        $util = scope.util;

    $app.ready(function() {
        $code.thread(function() {
            return $code.block(
                function() {
                    return scope.data.page('test');
                },
                function(pge){
                }
            );
        });
    });

    $app.start();
});