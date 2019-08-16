backbrace.controller('component', function(viewer) {

    var page = viewer.page;

    return backbrace.promiseblock(
        function() {
            // Get the design on the page.
            return backbrace.get('design/page/components/' + page.name + '.json');
        },
        function(json) {

            page.sections.forEach(function(s, i) {

                // Handle title section.
                if (s.name === 'Title')
                    viewer.sections.get(s.name).template = '<a class="link" route="components">< Components</a>' +
                        '<h4>' + page.caption + '</h4>' +
                        s.options.template;

                // Add section source.
                if (s.name.indexOf('Source') !== -1 && i > 0) {
                    viewer.sections.get(s.name).template = '<pre style="width: 100%;height: auto;"><code class="json">' +
                        JSON.stringify(json.sections[i - 1], null, 2)
                        + '</code></pre>';
                }
            });
        }
    );
});
