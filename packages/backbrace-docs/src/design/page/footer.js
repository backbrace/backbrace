'use strict';

backbrace.controller('footer', function(viewer) {

    var $ = backbrace.jquery(),
        page = viewer.sections.get('main');

    // Set the page template.
    page.template = '{{html}}';

    // Filter the data.
    viewer.onBeforeUpdate = function(data) {

        viewer.data = $.grep(data, function(val) {
            return val.name.toLowerCase() === 'footer';
        });
    };

});
