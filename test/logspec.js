'use strict';

describe('log module', function() {

    var logger, log, warn, info, error, debug;

    beforeEach(function() {

        logger = '';
        log = function() { logger += 'log;'; };
        warn = function() { logger += 'warn;'; };
        info = function() { logger += 'info;'; };
        error = function() { logger += 'error;'; };
        debug = function() { logger += 'debug;'; };

        Jumpstart.settings.debug = true;
    });

    afterEach(function() {
        // Reset the window.
        Jumpstart.window.set(window);
        Jumpstart.settings.debug = false;
    });

    it('should use console if present', function() {
        Jumpstart.window.set({
            navigator: { userAgent: window.navigator.userAgent },
            document: {},
            console: {
                log: log,
                warn: warn,
                info: info,
                error: error,
                debug: debug
            }
        });
        Jumpstart.logInfo('message');
        Jumpstart.logWarning('message');
        Jumpstart.logError('message');
        Jumpstart.logDebug('message');
        expect(logger).toBe('info;warn;error;debug;');
    });

    it('should use console.log() if other not present', function() {
        Jumpstart.window.set({
            navigator: { userAgent: window.navigator.userAgent },
            document: {},
            console: {
                log: log
            }
        });
        Jumpstart.logInfo('message');
        Jumpstart.logWarning('message');
        Jumpstart.logError('message');
        Jumpstart.logDebug('message');
        expect(logger).toBe('log;log;log;log;');
    });

    it('should use noop if there is no console', function() {
        Jumpstart.window.set({
            navigator: { userAgent: window.navigator.userAgent },
            document: {}
        });
        Jumpstart.logInfo('message');
        Jumpstart.logWarning('message');
        Jumpstart.logError('message');
        Jumpstart.logDebug('message');
        expect(logger).toBe('');
    });
});
