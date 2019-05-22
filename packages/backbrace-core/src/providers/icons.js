/**
 * Icons provider module.
 * @module iconsprovider
 * @private
 */

/** @type {iconsInstance} */
let instance = {
    get: function(name) {
        return name;
    }
};

/**
 * Get the icon provider instance.
 * @returns {iconsInstance} Returns the icon provider instance.
 */
export function get() {
    return instance;
}

/**
 * Set the icon provider instance.
 * @param {iconsInstance} val Icon provider instance to set.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
