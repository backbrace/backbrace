/**
 * Implimentation of JSS (using javascript to describe styles). Compiles to CSS at runtime.
 * @module
 */
'use strict';

var $config = require('./config'),
    $util = require('./util');


/**
 * Merge the JSS with the config.
 * @param {string} val - JSS value to merge.
 */
function mergeConfig(val) {

    // Loop through the style config.
    $util.forEach($config.style, function(style_item, style_key) {

        // Loop though the sub config (colors,images,etc).
        $util.forEach(style_item, function(item, key) {

            // Check for a merge field and replace.
            if (val.indexOf('%' + style_key + ':' + key + '%') !== -1)
                val = val.replace('%' + style_key + ':' + key + '%', item);
        });
    });

    return val;
}

/**
 * Compile a JSS object into a CSS string.
 * @param {*} obj - JSS object to compile.
 * @returns {string}
 */
function compile(obj) {

    var css = '';

    // Loop through css classes.
    $util.forEach(obj, function(cls, className) {

        css += className + '{';
        var othercss = '';

        // Loop through styles in the class.
        $util.forEach(cls, function(style, styleName) {

            // Check for a multi style.
            if (Array.isArray(style)) {
                $util.forEach(style, function(multistyle, msName) {
                    css += styleName + ': ' + mergeConfig(multistyle) + ';';
                });
            } else if (styleName.indexOf && styleName.indexOf('@media') === 0) {
                othercss += styleName + '{' + className + '{';
                $util.forEach(style, function(otherstyle, osName) {
                    othercss += osName + ': ' + mergeConfig(otherstyle) + ';';
                });
                othercss += '}}';
            } else {
                css += styleName + ': ' + mergeConfig(style) + ';';
            }
        });

        css += '}' + othercss;
    });

    return css;
}

module.exports = {
    compile: compile
};
