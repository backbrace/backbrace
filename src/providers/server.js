'use strict';

var code = require('../code'),
    http = require('../http');

/** @type {ServerInstance} */
var instance = {

    autoLogin: function() {
        return code.block(
            function() {
                return false;
            }
        );
    }
};

/**
 * Get the server provider instance.
 * @returns {ServerInstance} Returns the server provider instance.
 */
function get() {
    return instance;
}

/**
 * Set the server provider instance.
 * @param {ServerInstance} ref Server provider instance to set.
 * @returns {void}
 */
function set(ref) {
    instance = ref;
}

module.exports = {
    get: get,
    set: set
};
