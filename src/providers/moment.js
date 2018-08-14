/**
 * Readonly moment provider module.
 * @module moment
 * @private
 */

/**
 * Create a new moment instance.
 * @param {moment.MomentInput} [inp] Input object.
 * @param {moment.MomentFormatSpecification} [format] Format object.
 * @returns {moment.Moment} Returns the moment instance.
 */
export function get(inp, format) {
    return (window['moment'] ? window['moment'](inp, format) : null);
}
