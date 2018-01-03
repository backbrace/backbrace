/**
 * Alert box provider.
 * @module $alert
 */
'use strict';

var $window = require('./window');

/**
 * @type {Jumpstart.AlertInstance}
 * @private
 */
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
 * Get the alert box instance.
 * @memberof module:$alert
 * @returns {Jumpstart.AlertInstance} Returns the alert instance.
 */
function get() {
    return instance;
}

/**
 * @memberof module:$alert
 * @description
 * Set the alert instance. The following object signature is required:
 * ```js
 * {
 *  message: function(msg, callback, title) {
 *  },
 *  confirm: function(msg, callback, title, yescaption, nocaption) {
 *  },
 *  error: function(msg) {
 *  }
 * }
 * ```
 * @param {Jumpstart.AlertInstance} ref Alert instance to set.
 * @returns {void}
 */
function set(ref) {
    instance = ref;
}

module.exports = {
    get: get,
    set: set
};
