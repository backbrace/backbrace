'use strict';

backbrace.controller('test', function(viewer) {

    viewer.onActionClick.set('Code', function() {
        backbrace.loadPage('page/editor');
    });

});
