/**
 * Backbrace modules.
 * @module module
 * @private
 */

import { error } from './error';
import { settings } from './settings';
import { isDefined } from './util';
import { get as getWindow } from './providers/window';

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
 * @async
 * @param {string} name File name. We will attempt to load the file from the design dir.
 * @returns {Promise} Promise to return after we load the module.
 */
export async function load(name) {

    return new Promise(resolve => {

        const window = getWindow();

        // Check if we are loading a js file and the module doesn't exist.
        if (name.toLowerCase().indexOf('.js') !== -1 && !exists(name)) {

            let script = window.document.createElement('script');
            script.type = 'module';
            script.src = settings.dir.design + name;
            script.onerror = function() {
                throw moduleError('noexists', 'Cannot find module \'{0}\'', name);
            };
            script.onload = function() {
                resolve(get(name));
            };
            window.document.head.appendChild(script);

        } else {
            window.setTimeout(() => resolve(get(name)), 10);
        }

    });
}
