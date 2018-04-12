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

        js.settings({debug:true});
    });

    afterEach(function() {
        // Reset the window.
        js.setWindow(window);
        js.settings({debug:false});
    });

    it('should use console if present', function() {
        js.setWindow({
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
        js.logInfo('message');
        js.logWarning('message');
        js.logError('message');
        js.logDebug('message');
        expect(logger).toBe('info;warn;error;debug;');
    });

    it('should use console.log() if other not present', function() {
        js.setWindow({
            navigator: { userAgent: window.navigator.userAgent },
            document: {},
            console: {
                log: log
            }
        });
        js.logInfo('message');
        js.logWarning('message');
        js.logError('message');
        js.logDebug('message');
        expect(logger).toBe('log;log;log;log;');
    });

    it('should use noop if there is no console', function() {
        js.setWindow({
            navigator: { userAgent: window.navigator.userAgent },
            document: {}
        });
        js.logInfo('message');
        js.logWarning('message');
        js.logError('message');
        js.logDebug('message');
        expect(logger).toBe('');
    });
});
