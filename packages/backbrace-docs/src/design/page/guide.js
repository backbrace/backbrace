'use strict';

backbrace.controller('guide', function(viewer) {

    var $ = backbrace.jquery(),
        main = viewer.sections.get('main'),
        editurl = 'https://github.com/backbrace/backbrace/edit/master/packages/backbrace-docs/content/{0}.md?message=docs(core)%3A%20describe%20your%20change...';

    // Set the page template.
    main.template = '<div style="min-height:60vh">{{githublink}}{{html}}</div>';

    function addGithubLink(name, parent) {
        parent = parent || name;
        return '<a title="Suggest a change" class="suggest-link" aria-hidden="true" href="' +
            backbrace.formatString(editurl, parent + '/' + name) +
            '"><i class="mdi mdi-pencil"></i></a>';
    }

    // Filter the data.
    viewer.events.beforeUpdate = function(data) {

        var name = viewer.params['name'] || 'index',
            p = viewer.params['parent'],
            d = null;

        // Get the guide from the data.
        data = $.grep(data, function(val) {
            return val.name.toLowerCase() === name && (!p || p.toLowerCase() === val.parent.toLowerCase());
        }).map(function(val) {
            if (val.type === 2)
                val.githublink = addGithubLink(val.name, val.parent);
            return val;
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

    viewer.events.afterUpdate = function() {
        // Syntax highlighting.
        main.container.find('pre code').each(function(i, ele) {
            var btn = $('<i class="mdi mdi-content-copy copy-source" title="Click to copy source"></i>').prependTo($(ele).parent());
            var clipboard = backbrace.clipboard(btn[0], ele.innerHTML);
            clipboard.on('success', function() {
                // TODO MAKE COMPONENT
                var notify = $('<div class="notify show">Code copied!</div>').appendTo('body');
                setTimeout(function() {
                    notify.remove();
                }, 2000);
            });
            backbrace.highlightSyntax(ele);
        });
    };

});
