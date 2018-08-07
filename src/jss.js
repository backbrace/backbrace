/**
 * Implimentation of JSS (using javascript to describe styles). Compiles to CSS at runtime.
 * @module jss
 * @private
 */
'use strict';

import { settings } from './settings';
import { forEach } from './util';

/**
 * Merge the JSS with the config.
 * @param {string} val JSS value to merge.
 * @returns {string} Merged JSS value.
 */
function mergeConfig(val) {

    // Loop through the style config.
    forEach(settings.style, function(styleitem, stylekey) {

        // Loop though the sub config (colors,images,etc).
        forEach(styleitem, function(item, key) {

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
export function compile(obj) {

    let css = '';

    // Loop through css classes.
    forEach(obj, function(cls, className) {

        css += className + '{';
        let othercss = '';

        // Loop through styles in the class.
        forEach(cls, function(style, styleName) {

            // Check for a multi style.
            if (Array.isArray(style)) {
                forEach(style, function(multistyle, msName) {
                    css += mergeConfig(styleName.toString()) + ': ' + mergeConfig(multistyle) + ';';
                });
            } else if (typeof styleName === 'string'
                && styleName.indexOf && styleName.indexOf('@media') === 0) {
                othercss += mergeConfig(styleName) + '{' + className + '{';
                forEach(style, function(otherstyle, osName) {
                    othercss += mergeConfig(osName.toString()) + ': ' + mergeConfig(otherstyle) + ';';
                });
                othercss += '}}';
            } else {
                css += mergeConfig(styleName.toString()) + ': ' + mergeConfig(style) + ';';
            }
        });

        css += '}' + othercss;
    });

    return css;
}
