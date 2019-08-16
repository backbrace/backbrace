'use strict';

backbrace.controller('apihome', function(viewer) {

    var main = viewer.sections.get('main');

    // Set the page template.
    main.template = '<h1 style="margin: 30px;">' + viewer.page.name + '</h1>' +
        '<div bb-repeat="true" class="col-sm-12 col-md-6 col-lg-4" style="line-height: 3em; font-size: 1em; display:inline-block; margin: 0;">' +
        '<label class="api-type {{kind}}" style="margin-right: 10px;"><a route="api/{{name}}">' +
        '{{kindInitials}}</label> {{name}} {{access}}</a></div>';

    // We need this because of all of the floating elements.
    main.container.css('overflow', 'hidden');

    // Filter and sort the data.
    viewer.events.beforeUpdate = function(data) {
        return data.map(function(value) { // Add extra fields.
            value.kindInitials = value.kind.substr(0, 1);
            if (value.access)
                value.access = '(' + value.access + ')';
            return value;
        }).sort(function(a, b) { // Sort the data.
            if (a.kind === b.kind)
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
            return a.kind > b.kind ? 1 : -1;
        });
    };

});
