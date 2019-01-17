'use strict';

backbrace.controller('apihome', function(viewer) {

    var $ = backbrace.jquery(),
        page = viewer.pageComponent;

    // Set the page template.
    page.template = '<h1 style="margin: 30px;">' + viewer.page.name + '</h1>' +
        '<div bb-repeat="true" class="col s12 m6 l4" style="line-height: 3em; font-size: 1em;">' +
        '<label class="api-type {{kind}}" style="margin-right: 10px;"><a route="api/{{name}}">' +
        '{{kindInitials}}</label> {{name}}</a></div>';

    // We need this because of all of the floating elements,
    page.container.css('overflow', 'hidden');

    // Filter and sort the data.
    viewer.onBeforeUpdate = function(data) {
        viewer.data = $.grep(data, function(val) { // Filter the data.
            return val.access !== 'private';
        }).map(function(value) { // Add extra fields.
            value.kindInitials = value.kind.substr(0, 1);
            return value;
        }).sort(function(a, b) { // Sort the data.
            if (a.name.toLowerCase() > b.name.toLowerCase())
                return -1;
            return 1;
        });
    };

});
