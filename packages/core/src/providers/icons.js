/**
 * Icons provider module. By default, it gets icons from Material Design Icons Webfont
 * (https://materialdesignicons.com/).
 * @module iconsprovider
 * @private
 */

/** @type {IconsInstance} */
let instance = {
    get: function(name, className) {

        // Set defaults.
        name = name || 'alert';

        // Map template.
        if (name.indexOf('%') === 0) {
            if (name === '%new%') {
                name = 'plus';
            } else if (name === '%delete%') {
                name = 'close';
            } else {
                name = name.replace(/%/g, '');
            }
        }

        // Prepend mdi- if missing.
        if (name.indexOf('mdi-') !== 0)
            name = 'mdi-' + name;

        return '<i class="mdi ' + name + (className ? ' ' + className : '') + '" />';
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
