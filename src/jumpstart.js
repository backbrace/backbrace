'use strict';

var $log = require('./log'),
    $settings = require('./settings'),
    $window = require('./providers/window');

/**
 * @module Jumpstart
 */
window['Jumpstart'] = {

    /**
     * Log an info message.
     * @memberof module:Jumpstart
     * @method
     * @param {string} msg Message to log.
     * @param {...*} [args] Arguments to merge into the message.
     * @returns {void}
     */
    logInfo: $log.info,
    logWarning: $log.warning,
    logError: $log.error,
    logDebug: $log.debug,

    settings: $settings,
    window: $window

};
