/**
 * Browser window module. Allows the window to be mocked for testing.
 * @module
 */
'use strict';

var window_instance = window;

/**
 * Get the browser window.
 * @returns {Window}
 */
function get() {
    return window_instance;
}

/**
 * Set the browser window instance.
 * @param {*} win
 */
function set(win) {
    window_instance = win;
}

module.exports = {
    get: get,
    set: set
};
