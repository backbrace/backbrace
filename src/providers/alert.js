/**
 * Alert box provider. By default, it uses native gui to show alerts.
 * @module alertprovider
 * @private
 */
'use strict';

var $window = require('./window');

var instance = {

    message: function(msg, callback, title) {
        var window = $window.get();
        window.alert(msg);
        if (callback)
            callback();
    },

    confirm: function(msg, callback, title, yescaption, nocaption) {
        var window = $window.get(),
            ret = window.confirm(msg);
        if (callback)
            callback(ret);
    },

    error: function(msg) {
        var window = $window.get();
        // Add error to body if it is loaded...
        if (window.document.body) {
            window.document.body.innerHTML = '<div style="padding: 30px; ' +
                'overflow-wrap: break-word;"><h1>Oops, we had an issue</h1>' + msg + '</div>';
        } else {
            window.alert(msg);
        }
    }
};

/**
 * Get the alert provider instance.
 * @memberof module:$alert
 * @returns {Object} Returns the alert provider instance.
 */
function get() {
    return instance;
}

/**
 * Set the alert provider instance.
 * @param {Object} ref Alert provider instance to set.
 * @returns {void}
 */
function set(ref) {
    instance = ref;
}

module.exports = {
    get: get,
    set: set
};
