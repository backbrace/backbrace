'use strict';

backbrace.controller('footer', function(viewer, section) {

    var $ = backbrace.jquery();

    // Set the section template.
    section.template = '{{html}}';
    section.container.css("width", "100vw");
    // Filter the data.
    section.events.beforeUpdate = function(data) {
        return $.grep(data, function(val) {
            return val.name.toLowerCase() === 'footer';
        });
    };

});
