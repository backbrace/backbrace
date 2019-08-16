/**
 * Error module.
 * @module error
 * @private
 */

import { formatString } from './util';
import { settings } from './settings';

/**
 * Create a rich error object.
 * @param {string} scope Name of the scope for the error (ie. app).
 * @param {*} [ErrorClass] Error constructor for the base error.
 * @returns {errorInstance} Returns the error instance.
 */
export function error(scope, ErrorClass) {
    ErrorClass = ErrorClass || Error;
    return function(code, message, ...args) {
        let errMessage = (settings.debug ? '[' + (scope ? scope + ':' : '') + code + '] ' : '') + formatString(message, ...args);
        return new ErrorClass(errMessage);
    };
}
