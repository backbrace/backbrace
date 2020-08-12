/**
 * Browser window provider module. Allows the window to be mocked for testing.
 * @module windowprovider
 * @private
 */

// eslint-disable-next-line no-undef
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
 * @param {(Window|Object)} val Window provider instance to set.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
