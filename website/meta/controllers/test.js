'use strict';

jumpstart(function(scope) {

    var $app = scope.app,
        $code = scope.code;

    scope.controller.create('test.js', function(page) {

        page.window.action('New').click(function() {
            $code.thread(function() {
                return $app.component().loadPage('test',{title:'Test Open'});
            });
        });

    });

});