'use strict';

backbrace.pageComponent('components/guide.js', function(comp) {

    var $ = backbrace.jquery();

    comp.update = function(data) {
        var name = this.viewer.params['name'] || 'index';
        var d = $.grep(data, function(val) {
            return val.name.toLowerCase() === name;
        });
        if (d.length > 0) {
            this.viewer.setTitle(name === 'index' ? '' : ' - ' + name);
            this.container.html(d[0].html);
        }
    };
    return comp;
});
