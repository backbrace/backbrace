/**
 * Backbrace modules.
 * @module module
 * @private
 */

import { error } from './error';
import { loadScript } from './packagemanager';
import { settings } from './settings';
import { isDefined } from './util';
import { get as getJQuery } from './providers/jquery';

let modules = {};

const moduleError = error('module');

/**
 * Create a controller.
 * @method controller
 * @memberof module:backbrace
 * @param {string} name Name of the controller to create.
 * @param {ControllerCallback} definition Definition of the controller.
 * @returns {void}
 */
export function controller(name, definition) {
    if (isDefined(modules[name]))
        throw moduleError('exists', 'Module is already defined \'{0}\'', name);
    modules[name] = definition;
}

/**
 * Create a page component.
 * @method pageComponent
 * @memberof module:backbrace
 * @param {string} name Name of the page component to create.
 * @param {PageComponentCallback} definition Definition of the page component.
 * @returns {void}
 */
export function pageComponent(name, definition) {
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
export function get(name) {
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
    return isDefined(modules[name]);
}

/**
 * Load a module from a file.
 * @ignore
 * @param {string} name File name. We will attempt to load the file from the meta dir.
 * @returns {JQueryPromise} Promise to return after we load the module.
 */
export function load(name) {
    // Check if we are loading a js file and the module doesn't exist.
    if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {
        const $ = getJQuery(),
            d = $.Deferred();
        loadScript(settings.meta.dir + name,
            function() {
                d.resolve();
            },
            function() {
                throw moduleError('noexists', 'Cannot find module \'{0}\'', name);
            });
        return d.promise();
    }
}
