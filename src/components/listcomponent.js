'use strict';

var app = require('../app'),
    packages = require('../packages'),
    packagemanager = require('../packagemanager');

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

    packagemanager.add(packages.jqgrid());
    packagemanager.load(function() {

    }, packageError);

};

ListComponent.prototype.show = function() {
};

ListComponent.prototype.hide = function() {
};

module.exports = ListComponent;
