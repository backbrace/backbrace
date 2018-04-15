'use strict';

var app = require('../app'),
    packages = require('../packages'),
    resources = require('../resources');

/**
 * List component.
 * @class
 * @private
 */
function ListComponent() {
}

ListComponent.prototype.unload = function() {
};

ListComponent.prototype.load = function() {

    function packageError() {
        var url = this.src || this.href || '';
        app.error('Unable to load ' + url);
    }

    resources.add(packages.jqgrid());
    resources.load(function(){

    },packageError);

};

ListComponent.prototype.show = function() {
};

ListComponent.prototype.hide = function() {
};

module.exports = ListComponent;
