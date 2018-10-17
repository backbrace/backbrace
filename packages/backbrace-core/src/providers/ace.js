/**
 * Readonly ace editor provider module.
 * @module ace
 * @private
 */

/**
 * Get ace if it has been loaded.
 * @returns {AceAjax.Ace} Returns the jquery instance.
 */
export function get() {
    return window['ace'] || null;
}
