/**
 * Progress provider.
 * @module progressprovider
 * @private
 */

let instance = '';

/**
 * Get the progress meter html.
 * @returns {string} Returns the progress meter html.
 */
export function get() {
    return instance;
}

/**
 * Set the progress meter html.
 * @param {string} val Progress meter html.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
