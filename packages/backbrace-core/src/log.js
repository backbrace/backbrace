/**
 * Logging module. Provides functions to log events.
 * @module log
 * @private
 */

import { settings } from './settings';
import { formatString, noop } from './util';

import { get as getWindow } from './providers/window';

/**
 * Write to the console.
 * @private
 * @param {*} msg Message to write.
 * @param {string} type Type of message.
 * @returns {void}
 */
function write(msg, type) {

    const window = getWindow(),
        dte = (new Date()).toISOString();

    // Add date and time to string.
    if (typeof msg === 'string')
        msg = `${dte} ${msg}`;

    // Write to the console if available.
    let console = window.console || { log: noop },
        consoleFn = console[type] || console.log || noop;

    try {
        consoleFn(msg);
    } catch (e) {
        // Sometimes the above function will error.
    }
}

/**
 * Log an info message.
 * @method logInfo
 * @memberof module:bb
 * @param {string} msg Message to log.
 * @returns {void}
 */
export function info(msg) {
    msg = formatString.apply(null, arguments);
    write(msg, 'info');
}

/**
 * Log an error.
 * @method logError
 * @memberof module:bb
 * @param {Error} err Error to log.
 * @returns {void}
 */
export function error(err) {
    write(err, 'error');
}

/**
 * Log a warning message.
 * @method logWarning
 * @memberof module:bb
 * @param {string} msg Message to log.
 * @returns {void}
 */
export function warning(msg) {
    msg = formatString.apply(null, arguments);
    write(msg, 'warn');
}

/**
 * Log a debug message (If debug mode is turned on).
 * @method logDebug
 * @memberof module:bb
 * @param {string} msg Message to log.
 * @returns {void}
 */
export function debug(msg) {
    if (settings.debug) {
        msg = formatString.apply(null, arguments);
        write(msg, 'debug');
    }
}

/**
 * Log an object.
 * @method logObject
 * @memberof module:bb
 * @param {*} obj Object to log.
 * @returns {void}
 */
export function object(obj) {
    obj = obj || {};
    const window = getWindow();
    if (window.console && window.console.dir) {
        write(obj, 'dir');
        return;
    }
    write(JSON.stringify(obj), 'log');
}
