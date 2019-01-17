'use strict';

backbrace.controller('guide', function(viewer) {

    var $ = backbrace.jquery(),
        page = viewer.pageComponent;

    // Set the page template.
    page.template = '{{html}}';

    // Filter the data.
    viewer.onBeforeUpdate = function(data) {

        var name = viewer.params['name'] || 'index',
            p = viewer.params['parent'],
            d = null;

        // Get the guide from the data.
        viewer.data = $.grep(data, function(val) {
            return val.name.toLowerCase() === name && (!p || p.toLowerCase() === val.parent.toLowerCase());
        });

        if (viewer.data.length === 0) {

            viewer.data = [];
            backbrace.loadPage('status/404');

        } else {

            d = viewer.data[0];

            // Set the title.
            viewer.setTitle(name === 'index' ? '' : ' - ' + d.title);

        }
    };

});
