/**
 * Alert box provider.
 * @module
 */
'use strict';

var $window = require('./window');

/**
 * Alert confirm callback.
 * @typedef {function(boolean):void} JSConfirmCallback
 */

/**
 * Alert instance.
 * @typedef {{message:function(string,Function,string):void,confirm:function(string,JSConfirmCallback,string,string,string):void,error:function(string):void}} JSAlertInstance
 */

/** @type {JSAlertInstance} */
var alert_instance = {
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
 * @returns {JSAlertInstance}
 */
function get() {
    return alert_instance;
}

/**
 * Set the alert box instance.
 * @param {JSAlertInstance} ai
 */
function set(ai) {
    alert_instance = ai;
}

module.exports = {
    get: get,
    set: set
};
