'use strict';

var app = require('./app'),
    code = require('./code'),
    controller = require('./controller'),
    log = require('./log'),
    settings = require('./settings'),
    util = require('./util'),
    windowprovider = require('./providers/window');

/**
 * @module js
 */
window['js'] = {

    /**
     * Get/Set the application settings.
     * @memberof module:js
     * @param {Settings} [newsettings] Settings to set.
     * @returns {Settings} Returns the app settings.
     */
    settings: function(newsettings) {
        util.extend(settings, newsettings);
        return settings;
    },

    // Utility module.
    id: util.nextID,

    // Log module.
    logInfo: log.info,
    logWarning: log.warning,
    logError: log.error,
    logDebug: log.debug,
    logObject: log.object,

    // Controller module.
    controller: controller.create,

    // App module.
    start: app.start,
    ready: app.ready,
    loadPage: app.loadPage,

    // Window provider.
    setWindow: function(val) {
        windowprovider.set(val);
    }

};
