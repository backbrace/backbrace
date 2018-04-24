'use strict';

var app = require('./app'),
    code = require('./code'),
    controller = require('./controller'),
    http = require('./http'),
    log = require('./log'),
    settings = require('./settings'),
    util = require('./util'),
    serverprovider = require('./providers/server'),
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
    decodeHTML: util.decodeHTML,
    sanitizeString: util.sanitizeString,
    findInput: util.findInput,

    // Log module.
    logInfo: log.info,
    logWarning: log.warning,
    logError: log.error,
    logDebug: log.debug,
    logObject: log.object,

    // Code module.
    block: code.block,
    thread: code.thread,
    insert: code.insert,

    // Controller module.
    controller: controller.create,

    // App module.
    start: app.start,
    ready: app.ready,
    loadPage: app.loadPage,

    // HTTP module.
    get: http.get,
    post: http.post,

    // Server provider.
    setServer: function(val) {
        serverprovider.set(val);
    },

    // Window provider.
    setWindow: function(val) {
        windowprovider.set(val);
    }

};
