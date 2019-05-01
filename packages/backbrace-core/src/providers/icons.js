/**
 * Icons provider module.
 * @module iconsprovider
 * @private
 */

/** @type {IconsInstance} */
let instance = {
    get: function(name) {
        return name;
    }
};

/**
 * Get the icon provider instance.
 * @returns {IconsInstance} Returns the icon provider instance.
 */
export function get() {
    return instance;
}

/**
 * Set the icon provider instance.
 * @param {IconsInstance} val Icon provider instance to set.
 * @returns {void}
 */
export function set(val) {
    instance = val;
}
