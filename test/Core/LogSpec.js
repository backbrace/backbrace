'use strict';

describe('$log', function() {

    var logger, log, warn, info, error, debug;

    beforeEach(function() {

        logger = '';
        log = function() { logger += 'log;'; };
        warn = function() { logger += 'warn;'; };
        info = function() { logger += 'info;'; };
        error = function() { logger += 'error;'; };
        debug = function() { logger += 'debug;'; };

        // Use a mock window.
        $window = {
            navigator: { userAgent: window.navigator.userAgent },
            document: {}
        };

        $log.debugMode(true);
    });

    afterEach(function() {
        // Reset the window helper.
        $window = window;
        $log.debugMode(false);
    });

    it('should use console if present', function() {
        $window.console = {
            log: log,
            warn: warn,
            info: info,
            error: error,
            debug: debug
        };
        $log.info('message');
        $log.warning('message');
        $log.error('message');
        $log.debug('message');
        expect(logger).toBe('info;warn;error;debug;');
    });

    it('should use console.log() if other not present', function() {
        $window.console = {
            log: log
        };
        $log.info('message');
        $log.warning('message');
        $log.error('message');
        $log.debug('message');
        expect(logger).toBe('log;log;log;log;');
    });

    it('should use noop if there is no console', function() {
        $log.info('message');
        $log.warning('message');
        $log.error('message');
        $log.debug('message');
        expect(logger).toBe('');
    });
});
