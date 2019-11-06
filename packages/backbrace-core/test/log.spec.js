import * as log from '../src/log';
import { settings } from '../src/settings';
import { set as setWindow } from '../src/providers/window';

describe('log module', function() {

    let logger, logdefault, warn, info, error, debug;

    beforeEach(function() {

        logger = '';
        logdefault = function() { logger += 'log;'; };
        warn = function() { logger += 'warn;'; };
        info = function() { logger += 'info;'; };
        error = function() { logger += 'error;'; };
        debug = function() { logger += 'debug;'; };

        settings.debug = true;
    });

    afterEach(function() {
        // Reset the window.
        setWindow(window);
        settings.debug = false;
    });

    it('should use console if present', function() {
        setWindow({
            navigator: { userAgent: window.navigator.userAgent },
            document: {},
            console: {
                log: logdefault,
                warn: warn,
                info: info,
                error: error,
                debug: debug
            }
        });
        log.info('message');
        log.warning('message');
        log.error(new Error('message'));
        log.debug('message');
        expect(logger).toBe('info;warn;error;debug;');
    });

    it('should use console.log() if other not present', function() {
        setWindow({
            navigator: { userAgent: window.navigator.userAgent },
            document: {},
            console: {
                log: logdefault
            }
        });
        log.info('message');
        log.warning('message');
        log.error(new Error('message'));
        log.debug('message');
        expect(logger).toBe('log;log;log;log;');
    });

    it('should use noop if there is no console', function() {
        setWindow({
            navigator: { userAgent: window.navigator.userAgent },
            document: {}
        });
        log.info('message');
        log.warning('message');
        log.error(new Error('message'));
        log.debug('message');
        expect(logger).toBe('');
    });
});
