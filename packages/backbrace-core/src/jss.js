/**
 * Implimentation of JSS (using javascript to describe styles). Compiles to CSS at runtime.
 * @module jss
 * @private
 */

/**
 * Iterate through an object.
 * @private
 * @param {Object} obj Object to iterate through.
 * @param {function(*,Key,object):void} iterator Iterator function to call.
 * @param {*} [context] Context to run the iterator function.
 * @returns {void}
 */
function forEach(obj, iterator, context) {
    if (obj)
        for (let key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                iterator.call(context, obj[key], key, obj);
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

            if (typeof styleName === 'string'
                && styleName.indexOf && styleName.indexOf('@media') === 0) {
                othercss += styleName + '{' + className + '{';
                forEach(style, function(otherstyle, osName) {
                    othercss += osName.toString() + ': ' + otherstyle + ';';
                });
                othercss += '}}';
            } else if (Array.isArray(style)) {
                forEach(style, function(substyle) {
                    css += styleName.toString() + ': ' + substyle + ';';
                });
            } else if (typeof style === 'object') {
                css += styleName.toString() + '{';
                forEach(style, function(multistyle, msName) {
                    css += msName.toString() + ': ' + multistyle + ';';
                });
                css += '}';
            } else {
                css += styleName.toString() + ': ' + style + ';';
            }
        });

        css += '}' + othercss;
    });

    return css;
}
