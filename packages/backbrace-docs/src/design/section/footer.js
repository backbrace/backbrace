'use strict';

backbrace.controller('footer', function(viewer, section) {

    var $ = backbrace.jquery();

    // Set the section template.
    section.template = '{{html}}';

    // Filter the data.
    section.onBeforeUpdate = function(data) {
        return $.grep(data, function(val) {
            return val.name.toLowerCase() === 'footer';
        });
    };

});
