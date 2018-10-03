/**
 * Error module.
 * @module error
 * @private
 */

import { isDevMode, formatString } from './util';

/**
 * Create a rich error object.
 * @param {string} scope Name of the scope for the error (ie. app).
 * @param {ErrorConstructor} [ErrorClass] Error constructor for the base error.
 * @returns {ErrorInstance} Returns the error instance.
 */
export function error(scope, ErrorClass) {
    ErrorClass = ErrorClass || Error;
    return function(code, message, ...args) {
        let errMessage = (isDevMode() ? '[' + (scope ? scope + ':' : '') + code + '] ' : '') + formatString(message, args);
        return new ErrorClass(errMessage);
    };
}
