/**
 * Controller module.
 * @module controller
 * @private
 */
'use strict';

var app = require('./app'),
    package = require('./package'),
    $settings = require('./settings'),
    $util = require('./util'),
    controllers = {};

/**
 * Create a controller.
 * @method controller
 * @memberof module:Jumpstart
 * @param {string} name Name of the controller to create.
 * @param {function(*)} definition Definition of the controller.
 * @returns {void};
 */
function create(name, definition) {
    if ($util.isDefined(controllers[name]))
        app.error('Controller is already defined: {0}', name);
    controllers[name] = definition;
}

/**
 * Get a controller.
 * @param {string} name Name of the controller to get.
 * @returns {function(*)} Returns the controller definition.
 */
function get(name) {
    if (!$util.isDefined(controllers[name]))
        app.error('Controller is not defined: {0}', name);
    return controllers[name];
}

/**
 * Check if a controller exists.
 * @param {string} name Name of the controller.
 * @returns {boolean} `True` if the controller exists.
 */
function exists(name) {
    return $util.isDefined(controllers[name]);
}

/**
 * Load a controller from a file.
 * @param {string} name File name. We will attempt to load the file from the meta/controllers dir.
 * @returns {JQueryPromise} Promise to return after we load the controller.
 */
function load(name) {
    // Check if we are loading a js file and the controller doesn't exist.
    if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {
        var $ = require('../external/jquery')(),
            d = $.Deferred();
        package.loadScript($settings.meta.dir + 'controllers/' + name,
            function() {
                d.resolve();
            },
            function() {
                app.error('Cannot find contoller: {0}', name);
            });
        return d.promise();
    }
}

module.exports = {
    create: create,
    get: get,
    exists: exists,
    load: load
};
