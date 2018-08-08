/**
 * Controller module.
 * @module controller
 * @private
 */

import { error } from './app';
import { loadScript } from './packagemanager';
import { settings } from './settings';
import { isDefined } from './util';
import { get as getJQuery } from './providers/jquery';

let controllers = {};

/**
 * Create a controller.
 * @method controller
 * @memberof module:js
 * @param {string} name Name of the controller to create.
 * @param {ControllerCallback} definition Definition of the controller.
 * @returns {void}
 */
export function create(name, definition) {
    if (isDefined(controllers[name]))
        error('Controller is already defined: {0}', name);
    controllers[name] = definition;
}

/**
 * Get a controller.
 * @ignore
 * @param {string} name Name of the controller to get.
 * @returns {function(*)} Returns the controller definition.
 */
export function get(name) {
    if (!isDefined(controllers[name]))
        error('Controller is not defined: {0}', name);
    return controllers[name];
}

/**
 * Check if a controller exists.
 * @ignore
 * @param {string} name Name of the controller.
 * @returns {boolean} `True` if the controller exists.
 */
export function exists(name) {
    return isDefined(controllers[name]);
}

/**
 * Load a controller from a file.
 * @ignore
 * @param {string} name File name. We will attempt to load the file from the meta/controllers dir.
 * @returns {JQueryPromise} Promise to return after we load the controller.
 */
export function load(name) {
    // Check if we are loading a js file and the controller doesn't exist.
    if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {
        const $ = getJQuery(),
            d = $.Deferred();
        loadScript(settings.meta.dir + 'controllers/' + name,
            function() {
                d.resolve();
            },
            function() {
                error('Cannot find contoller: {0}', name);
            });
        return d.promise();
    }
}
