'use strict';

js.controller('test.js', function(page) {

    var actions = page.actions;

    actions.action('New').click(function() {
        js.loadPage('test sub');
    });

});
