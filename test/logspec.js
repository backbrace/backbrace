'use strict';

jumpstart(function(scope) {

    var $log = scope.log,
        $window = scope.window;

    describe('log module', function() {

        var logger, log, warn, info, error, debug;

        beforeEach(function() {

            logger = '';
            log = function() { logger += 'log;'; };
            warn = function() { logger += 'warn;'; };
            info = function() { logger += 'info;'; };
            error = function() { logger += 'error;'; };
            debug = function() { logger += 'debug;'; };

            $log.debugMode(true);
        });

        afterEach(function() {
            // Reset the window.
            $window.set(window);
            $log.debugMode(false);
        });

        it('should use console if present', function() {
            $window.set({
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
            $log.info('message');
            $log.warning('message');
            $log.error('message');
            $log.debug('message');
            expect(logger).toBe('info;warn;error;debug;');
        });

        it('should use console.log() if other not present', function() {
            $window.set({
                navigator: { userAgent: window.navigator.userAgent },
                document: {},
                console: {
                    log: log
                }
            });
            $log.info('message');
            $log.warning('message');
            $log.error('message');
            $log.debug('message');
            expect(logger).toBe('log;log;log;log;');
        });

        it('should use noop if there is no console', function() {
            $window.set({
                navigator: { userAgent: window.navigator.userAgent },
                document: {}
            });
            $log.info('message');
            $log.warning('message');
            $log.error('message');
            $log.debug('message');
            expect(logger).toBe('');
        });
    });

});
