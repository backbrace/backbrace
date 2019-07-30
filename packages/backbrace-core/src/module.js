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
 * @param {string} name Name of the module.
 * @returns {boolean} `True` if the module exists.
 */
export function exists(name) {
    name = name.split('/').pop().replace('.js', '');
    return isDefined(modules[name]);
}

/**
 * Load a module from a file.
 * @param {string} name File name. We will attempt to load the file from the design dir.
 * @returns {JQueryPromise|function(*)} Promise to return after we load the module.
 */
export function load(name) {
    // Check if we are loading a js file and the module doesn't exist.
    if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {

        const d = $.Deferred();

        $.getScript({
            url: settings.dir.design + name,
            cache: true
        }).done(function() {
            d.resolve(get(name));
        }).fail(function() {
            throw moduleError('noexists', 'Cannot find module \'{0}\'', name);
        });

        return d.promise();

    } else {
        return get(name);
    }

}
