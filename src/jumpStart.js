'use strict';

var scope = require('./scope');

// Expose jumpstart to the window.
window['jumpstart'] = function(fn) {
    if (fn) fn(scope);
};
