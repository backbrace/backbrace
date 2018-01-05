'use strict';

jumpstart(function(scope) {

    var $app = scope.app;

    scope.controller.create('test.js', function(page) {

        page.window.action('New').click(function() {
            $app.message('New Clicked');
        });

    });

});