/**
 * @module packages
 * @private
 */

import { settings } from './settings';
import { isDefined, deepMap, formatString, isMobileDevice } from './util';

const packages = {
    'ace': [
        ['{1}/ace.js'],
        ['{1}/ext-tern.js']
    ],
    'jqgrid': [
        (isMobileDevice() ? null : ['jquery.{0}.js', 'ui.{0}.css', 'i18n/grid.locale-en.js'])
    ],
    'jquery': [
        ['{0}.js']
    ],
    'jquery-ripple': [
        ['jquery.ripple.js', 'jquery.ripple.css']
    ],
    'jquery-ui': [
        ['{0}.js', '{0}.css']
    ],
    'materialdesignicons': [
        ['css/{0}.css']
    ],
    'moment': [
        ['{0}.js'],
        ['locale/en-au.js']
    ],
    'resetcss': [
        ['reset.css']
    ],
    'sweetalert': [
        ['{0}.js', 'sweetalert.css']
    ]
};

/**
 * Check if a package exists.
 * @param {string} name Name of the package.
 * @returns {boolean} Returns `true` if the package exists.
 */
export function exists(name) {
    return isDefined(packages[name]);
}

/**
 * Get a package.
 * @param {string} name Name of the package.
 * @returns {Array.<string[]>} Returns the package if found.
 */
export function get(name) {
    if (isDefined(packages[name])) {
        const p = packages[name],
            m = (settings.minify ? '.min' : ''),
            fm = (settings.minify ? 'min' : 'src');
        return deepMap(p, val => `${settings.packages}/${name}/${formatString(val, name + m, fm)}`);
    }
    return null;
}
