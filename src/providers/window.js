/**
 * Browser window provider module. Allows the window to be mocked for testing.
 * @module windowprovider
 * @private
 */

let instance = window;

/**
 * Get the window provider instance.
 * @returns {Window} Returns the window provider instance.
 */
export function get() {
    return instance;
}

/**
 * Set the window provider instance.
 * @method setWindow
 * @memberof module:js
 * @param {(Window|object)} val Window provider instance to set.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
