/**
 * Browser window provider module. Allows the window to be mocked for testing.
 * @module
 */
'use strict';

var instance = window;

/**
 * Get the browser window instance.
 * @returns {Window} Returns the window instance.
 */
function get() {
    return instance;
}

/**
 * Set the browser window instance.
 * @param {(Window|Object)} win Window instance to set.
 * @returns {void}
 */
function set(win) {
    instance = win;
}

module.exports = {
    get: get,
    set: set
};
