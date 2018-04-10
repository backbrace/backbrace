/**
 * Browser window provider module. Allows the window to be mocked for testing.
 * @module window
 * @private
 */
'use strict';

var instance = window;

/**
 * Get the window provider instance.
 * @returns {Window} Returns the window provider instance.
 */
function get() {
    return instance;
}

/**
 * Set the window provider instance.
 * @method setWindow
 * @memberof module:Jumpstart
 * @param {(Window|Object)} val Window provider instance to set.
 * @returns {void}
 */
function set(val) {
    instance = val;
}

module.exports = {
    get: get,
    set: set
};
