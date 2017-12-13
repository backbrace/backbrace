/**
 * Logging module. Provides functions to log events.
 * @module
 */
'use strict';

var $util = require('./util'),
    debugFlag = false;

/**
 * Write to the console.
 * @param {*} msg - Message to write.
 * @param {string} type - Type of message.
 */
function write(msg, type) {

    var $window = require('./window').get(),
        dte = new Date();

    // Add date and time to string.
    if (typeof msg === 'string' && dte.toISOString)
        msg = $util.formatString('{0} {1}',
            dte.toISOString(), msg);

    // Write to the console if available.
    var console = $window.console || { log: $util.noop },
        consoleFn = console[type] || console.log || $util.noop;

    $util.noThrow(function() {
        consoleFn(msg);
    });
}

/**
 * Turn on/off debug messages.
 * @param {boolean} flag - Flag debug messages on or off.
 */
function debugMode(flag) {
    debugFlag = flag;
}

/**
 * Log an info message.
 * @param {string} msg - Message to log.
 */
function info(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'info');
}

/**
 * Log an error message.
 * @param {string} msg - Message to log.
 */
function error(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'error');
}

/**
 * Log a warning message.
 * @param {string} msg - Message to log.
 */
function warning(msg) {
    msg = $util.formatString.apply(null, arguments);
    write(msg, 'warn');
}

/**
 * Log a debug message (If debug mode is turned on).
 * @param {string} msg - Message to log.
 */
function debug(msg) {
    if (debugFlag) {
        msg = $util.formatString.apply(null, arguments);
        write(msg, 'debug');
    }
}

/**
 * Log an object.
 * @param {Object} obj - Object to log.
 */
function object(obj) {
    var $window = require('./window').get();
    if ($window.console && $window.console.dir) {
        write(obj, 'dir');
        return;
    }
    write(JSON.stringify(obj), 'log');
}

module.exports = {
    debugMode: debugMode,
    info: info,
    error: error,
    warning: warning,
    debug: debug,
    object: object
};
