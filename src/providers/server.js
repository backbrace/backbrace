/**
 * Server provider module.
 * @module serverprovider
 * @private
 */

import { codeblock } from '../code';

/** @type {ServerInstance} */
let instance = {

    autoLogin: function() {
        return codeblock(
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
export function get() {
    return instance;
}

/**
 * Set the server provider instance.
 * @param {ServerInstance} ref Server provider instance to set.
 * @returns {void}
 */
export function set(ref) {
    instance = ref;
}
