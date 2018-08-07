/**
 * @module packages
 * @private
 */

import { settings } from './settings';
import { isDefined, deepMap, formatString } from './util';

export let cdn = 'https://labs.zoomapps.com.au/JumpstartCDN';
const packages = {
    'jqgrid': [
        '4.5.4',
        [
            ['jquery.{0}.js', 'ui.{0}.css', 'i18n/grid.locale-en.js']
        ]
    ],
    'jquery': [
        '3.3.1',
        [
            ['{0}.js']
        ]
    ],
    'jquery-ripple': [
        '0.2.1',
        [
            ['jquery.ripple.js', 'jquery.ripple.css']
        ]
    ],
    'jquery-ui': [
        '1.12.1',
        [
            ['{0}.js', '{0}.css']
        ]
    ],
    'materialdesignicons': [
        '2.2.43',
        [
            ['css/{0}.css']
        ]
    ],
    'moment': [
        '2.22.0',
        [
            ['{0}.js'],
            ['locale/en-au.js']
        ]
    ],
    'resetcss': [
        '2.0.0',
        [
            ['reset.css']
        ]
    ],
    'sweetalert': [
        '1.1.3',
        [
            ['{0}.js', '{0}.css']
        ]
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
            v = p[0],
            m = (settings.minify ? '.min' : '');
        return deepMap(p[1], val => `${cdn}/${name}/${v}/${formatString(val, name + m)}`);
    }
    return null;
}
