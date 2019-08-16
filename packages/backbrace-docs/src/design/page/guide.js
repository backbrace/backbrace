'use strict';

backbrace.controller('guide', function(viewer) {

    var $ = backbrace.jquery(),
        main = viewer.sections.get('main');

    // Set the page template.
    main.template = '<div style="min-height:60vh">{{html}}</div>';

    // Filter the data.
    viewer.events.beforeUpdate = function(data) {

        var name = viewer.params['name'] || 'index',
            p = viewer.params['parent'],
            d = null;

        // Get the guide from the data.
        data = $.grep(data, function(val) {
            return val.name.toLowerCase() === name && (!p || p.toLowerCase() === val.parent.toLowerCase());
        });

        if (data.length === 0) {

            backbrace.routeError('404', 'We can\'t seem to find the page you\'re looking for.');

        } else {

            d = data[0];

            // Set the title.
            viewer.setTitle(name === 'index' ? '' : d.title);

        }

        return data;
    };

});
