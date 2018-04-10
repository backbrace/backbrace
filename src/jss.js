/**
 * Implimentation of JSS (using javascript to describe styles). Compiles to CSS at runtime.
 * @module jss
 * @private
 */
'use strict';

var $settings = require('./settings'),
    $util = require('./util');

/**
 * Merge the JSS with the config.
 * @param {string} val JSS value to merge.
 * @returns {string} Merged JSS value.
 */
function mergeConfig(val) {

    // Loop through the style config.
    $util.forEach($settings.style, function(styleitem, stylekey) {

        // Loop though the sub config (colors,images,etc).
        $util.forEach(styleitem, function(item, key) {

            // Check for a merge field and replace.
            if (val.indexOf('%' + stylekey + ':' + key + '%') !== -1)
                val = val.replace('%' + stylekey + ':' + key + '%', item);
        });
    });

    return val;
}

/**
 * Compile a JSS object into a CSS string.
 * @param {*} obj JSS object to compile.
 * @returns {string} CSS string
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
