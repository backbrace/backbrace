/**
 * Icons provider module. By default, it gets icons from Material Design Icons Webfont
 * (https://materialdesignicons.com/).
 * @module iconsprovider
 * @private
 */
'use strict';

var instance = {
    get: function(name, size) {

        // Set defaults.
        name = name || 'alert';
        size = size || 15;

        // Prepend mdi- if missing.
        if (name.indexOf('mdi-') !== 0)
            name = 'mdi-' + name;

        return '<i class="mdi ' + name + '" style="font-size: ' + size + 'px" />';
    }
};

/**
 * Get the icon provider instance.
 * @returns {Object} Returns the icon provider instance.
 */
function get() {
    return instance;
}

/**
 * Set the icon provider instance.
 * @param {Object} val Icon provider instance to set.
 * @returns {void}
 */
function set(val) {
    instance = val;
}

module.exports = {
    get: get,
    set: set
};
