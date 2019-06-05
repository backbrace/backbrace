'use strict';

backbrace.controller('apihome', function(viewer) {

    var page = viewer.pageComponent;

    // Set the page template.
    page.template = '<h1 style="margin: 30px;">' + viewer.page.name + '</h1>' +
        '<div bb-repeat="true" class="col s12 m6 l4" style="line-height: 3em; font-size: 1em;">' +
        '<label class="api-type {{kind}}" style="margin-right: 10px;"><a route="api/{{name}}">' +
        '{{kindInitials}}</label> {{name}} {{access}}</a></div>';

    // We need this because of all of the floating elements,
    page.container.css('overflow', 'hidden');

    // Filter and sort the data.
    viewer.onBeforeUpdate = function(data) {
        viewer.data = data.map(function(value) { // Add extra fields.
            value.kindInitials = value.kind.substr(0, 1);
            if (value.access)
                value.access = '(' + value.access + ')';
            return value;
        }).sort(function(a, b) { // Sort the data.
            if (a.kind === b.kind)
                return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
            return a.kind < b.kind ? 1 : -1;
        });
    };

});