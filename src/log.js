/**
 * Logging module. Provides functions to log events.
 * @module
 */
'use strict';

var $settings = require('./settings'),
    $util = require('./util'),
    $window = require('./providers/window');

/**
 * Write to the console.
 * @param {*} msg Message to write.
 * @param {string} type Type of message.
 * @returns {void}
 */
function write(msg, type) {

    var window = $window.get(),
        dte = new Date();

    // Add date and time to string.
    if (typeof msg === 'string' && dte.toISOString)
        msg = $util.formatString('{0} {1}',
            dte.toISOString(), msg);

    // Write to the console if available.
    var console = window.console || { log: $util.noop },
        consoleFn = console[type] || console.log || $util.noop;

    try {
        consoleFn(msg);
    } catch (e) {
        // Sometimes the above function will error.
    }
}

/**
 * Log an info message.
 * @param {string} msg Message to log.
 * @returns {void}
 */
function info(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'info');
}

/**
 * Log an error message.
 * @param {string} msg Message to log.
 * @returns {void}
 */
function error(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'error');
}

/**
 * Log a warning message.
 * @param {string} msg Message to log.
 * @returns {void}
 */
function warning(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'warn');
}

/**
 * Log a debug message (If debug mode is turned on).
 * @param {string} msg Message to log.
 * @returns {void}
 */
function debug(msg) {
    if ($settings.debug) {
        msg = $util.formatString.apply(null, arguments);
        write(msg, 'debug');
    }
}

/**
 * Log an object.
 * @param {Object} obj Object to log.
 * @returns {void}
 */
function object(obj) {
    var window = $window.get();
    if (window.console && window.console.dir) {
        write(obj, 'dir');
        return;
    }
    write(JSON.stringify(obj), 'log');
}

module.exports = {
    info: info,
    error: error,
    warning: warning,
    debug: debug,
    object: object
};
