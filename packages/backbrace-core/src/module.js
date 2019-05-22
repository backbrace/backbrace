/**
 * Backbrace modules.
 * @module module
 * @private
 */

import $ from 'jquery';
import { error } from './error';
import { settings } from './settings';
import { isDefined } from './util';

let modules = {};

const moduleError = error('module');

/**
 * Create a controller module.
 * @method controller
 * @memberof module:backbrace
 * @param {string} name Name of the controller to create.
 * @param {controllerCallback} definition Definition of the controller.
 * @returns {void}
 */
export function controller(name, definition) {
    if (isDefined(modules[name]))
        throw moduleError('exists', 'Module is already defined \'{0}\'', name);
    modules[name] = definition;
}

/**
 * Get a module.
 * @ignore
 * @param {string} name Name of the module to get.
 * @returns {function(*)} Returns the module definition.
 */
function get(name) {
    name = name.split('/').pop().replace('.js', '');
    if (!isDefined(modules[name]))
        throw moduleError('noexists', 'Module is not defined \'{0}\'', name);
    return modules[name];
}

/**
 * Check if a module exists.
 * @ignore
 * @param {string} name Name of the module.
 * @returns {boolean} `True` if the module exists.
 */
export function exists(name) {
    name = name.split('/').pop().replace('.js', '');
    return isDefined(modules[name]);
}

/**
 * Load a module from a file.
 * @ignore
 * @param {string} name File name. We will attempt to load the file from the meta dir.
 * @returns {JQueryPromise|function(*)} Promise to return after we load the module.
 */
export function load(name) {
    // Check if we are loading a js file and the module doesn't exist.
    if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {

        const d = $.Deferred();

        $.getScript(settings.meta.dir + name)
            .done(function() {
                d.resolve(get(name));
            })
            .fail(function() {
                throw moduleError('noexists', 'Cannot find module \'{0}\'', name);
            });

        return d.promise();

    } else {
        return get(name);
    }

}
