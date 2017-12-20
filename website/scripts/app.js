'use strict';

jumpstart(function(scope) {

    var $app = scope.app,
        $code = scope.code,
        $config = scope.config,
        $util = scope.util;

    $app.ready(function() {
        $code.thread(function() {
            return $code.block(
                function() {
                    return $config.page('test');
                },
                function(pge){
                }
            );
        });
    });

    $app.start();
});