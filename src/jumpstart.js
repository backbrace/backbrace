'use strict';

var scope = require('./scope');

/**
 * The jumpstart function. This is used to access the jumpstart scope.
 * @method jumpstart
 * @param {function(Jumpstart.Scope)} fn Callback function that is provided the jumpstart scope.
 * @returns {void}
 */
window['jumpstart'] = function(fn) {
    if (fn) fn(scope);
};
