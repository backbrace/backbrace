'use strict';

jumpstart(function (scope) {

    var $app = scope.app,
        $code = scope.code,
        $meta = scope.meta,
        $util = scope.util;

    $app.ready(function () {
        $app.confirm('Load home?', function (ret) {
            $code.thread(function () {
                return $code.block(
                    function () {
                        return $meta.page('test');
                    },
                    function (pge) {
                    }
                );
            });
        });
    });

    $app.start();
});