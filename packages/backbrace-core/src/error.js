import { settings } from './settings';
import { ComponentError } from './errors/component';

/**
 * Error module.
 * @module error
 * @private
 */

/**
 * Create a rich error object.
 * @param {string} scope Name of the scope for the error (ie. app).
 * @param {import('./components/component').Component} [comp] Component which caused the error.
 * @param {import('./types').errorClass} [ErrorClass] Error constructor for the base error.
 * @returns {import('./types').errorInstance} Returns the error instance.
 */
export function error(scope, comp, ErrorClass) {
    ErrorClass = ErrorClass || ComponentError;
    return function(code, message) {
        let errMessage = `${settings.debug ? `[${scope ? scope + ':' : ''}${code}] ` : ''}${message}`;
        let err = new ErrorClass(errMessage);
        if (err instanceof ComponentError)
            err.component = comp;
        return err;
    };
}
