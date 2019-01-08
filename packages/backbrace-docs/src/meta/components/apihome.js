'use strict';

backbrace.pageComponent('components/apihome.js', function(comp) {

    var $ = backbrace.jquery();

    comp.update = function(data) {

        var html = '<h1 style="margin: 30px;">API List</h1>';

        data = $.grep(data, function(val) {
            return val.access !== 'private' && val.kind !== 'typedef';
        }).sort(function(a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            return 1;
        });

        $.each(data, function(index, d) {
            html += '<div class="col s12 m6 l4" style="line-height: 3em; font-size: 1em"><label class="api-type ' +
                d.kind + '" style="margin-right: 10px;"><a route="api/' + d.name + '">' +
                d.kind.substr(0, 1) + '</label> ' + d.name + '</a></div>';
        });
        this.container.html(html);
    };
    return comp;
});
