'use strict';

js.controller('pages/employee card.js', function(page) {

    var actions = page.actions;

    actions.action('Delete').click(function() {
        js.message('Delete was clicked');
    });

});
