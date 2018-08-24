/**
 * Readonly JQuery provider module.
 * @module jquery
 * @private
 */

/**
 * Get jQuery if it has been loaded.
 * @returns {JQueryStatic} Returns the jquery instance.
 */
export function get() {
    return window['jQuery'] || null;
}
