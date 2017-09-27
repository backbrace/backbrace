'use strict';

/**
 * Logging helper.
 */
var $log = (function() {

    var debug = false;

    // Write to the console.
    function write(msg, type) {

        // Add date and time to string.
        var dte = new Date();
        if (typeof msg === 'string' && dte.toISOString)
            msg = $js.formatString('{0} {1}',
                dte.toISOString(), msg);

        // Write to the console if available.
        var console = $window.console || {},
            // @ts-ignore
            consoleFn = console[type] || console.log || $js.noop;

        try {
            consoleFn(msg);
        } catch (e) { /* empty */ }

    }

    return {

        /**
         * Turn on/off debug messages.
         * @param {boolean} flag - Flag debug messages on or off.
         */
        debugMode: function(flag) {
            debug = flag;
        },

        /**
         * Log an info message.
         * @param {string} msg - Message to log.
         */
        info: function(msg) {
            write(msg, 'info');
        },

        /**
         * Log an error message.
         * @param {string} msg - Message to log.
         */
        error: function(msg) {
            write(msg, 'error');
        },

        /**
         * Log a warning message.
         * @param {string} msg - Message to log.
         * @param {...*} [args] - Arguments to merge.
         */
        warning: function(msg, args) {
            msg = $js.formatString.apply(null, arguments);
            write(msg, 'warn');
        },
        /**
         * Log an debug message.
         * @param {string} msg - Message to log.
         */
        debug: function(msg) {
            if (debug)
                write(msg, 'debug');
        },
        /**
         * Log an object.
         * @param {Object} obj - Object to log.
         */
        object: function(obj) {
            if ($window.console && $window.console.dir) {
                write(obj, 'dir');
                return;
            }
            // @ts-ignore
            write($.to$jsON(obj), 'log');
        }
    };

})();
