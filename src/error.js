/**
 * Error module.
 * @module error
 * @private
 */

/**
 * Create a rich error object.
 * @param {string} scope Name of the scope for the error (ie. app).
 * @param {ErrorConstructor} [ErrorClass] Error constructor for the base error.
 * @returns {ErrorInstance} Returns the error instance.
 */
export function error(scope, ErrorClass) {
    ErrorClass = ErrorClass || Error;
    return function(code, message, ...args) {
        message = '[' + (scope ? scope + ':' : '') + code + '] ' + message;
        message = message.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number] : '';
        });
        return new ErrorClass(message);
    };
}
