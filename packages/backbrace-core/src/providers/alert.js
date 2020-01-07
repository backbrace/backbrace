/**
 * Alert box provider. By default, it uses native gui to show alerts.
 * @module alertprovider
 * @private
 */

import { get as getWindow } from './window';

/**
 * @type {alertInstance}
 * @ignore
 */
let instance = {

    message: function(msg, callback, title) {
        let window = getWindow();
        window.alert(msg);
        if (callback)
            callback();
    },

    confirm: function(msg, callback, title, yescaption, nocaption) {
        let window = getWindow(),
            ret = window.confirm(msg);
        if (callback)
            callback(ret);
    },

    error: function(msg) {
        let window = getWindow();
        // Add error to body if it is loaded...
        if (window.document.body) {
            window.document.body.innerHTML = `<div style="padding: 30px;overflow-wrap: break-word;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,Segoe UI Emoji, Segoe UI Symbol;">
            <img src='skull-outline.png' />
            <h1 style="font-size: 120%;font-weight:bold;margin:8px 0 8px 0;">Oops, we had an issue</h1>${msg}</div>`;
        } else {
            window.alert(msg);
        }
    }
};

/**
 * Get the alert provider instance.
 * @returns {alertInstance} Returns the alert provider instance.
 */
export function get() {
    return instance;
}

/**
 * Set the alert provider instance.
 * @param {alertInstance} ref Alert provider instance to set.
 * @returns {void}
 */
export function set(ref) {
    instance = ref;
}
