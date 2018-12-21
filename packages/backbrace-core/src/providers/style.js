/**
 * App style provider module.
 * @module styleprovider
 * @private
 */

import { style } from '../styles/flat';

let instance = style;

/**
 * Get the style instance.
 * @private
 * @returns {object} Returns the style instance.
 */
export function get() {
    return instance;
}

/**
 * Set the application style.
 * @method setStyle
 * @memberof module:backbrace
 * @param {object} val Style to set as a jss object.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
