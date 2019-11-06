import * as util from '../src/util';
import { get as getWindow, set as setWindow } from '../src/providers/window';

describe('util', function() {

    describe('uid', function() {
        it('should generate a unique id', function() {
            let id = util.uid(),
                uid = util.uid();
            expect(uid).toBe(id + 1);
        });
    });

    describe('feature detection', function() {
        it('should detect mobile/desktop devices', function() {

            // Android device.
            setWindow({
                navigator: {
                    userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 ' +
                        'Mobile Safari/537.36'
                }
            });
            expect(util.isMobileDevice()).toBe(true);

            // IPhone device.
            setWindow({
                navigator: {
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) ' +
                        'AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 ' +
                        'Safari/604.1'
                }
            });
            expect(util.isMobileDevice()).toBe(true);

            // Desktop.
            setWindow({
                navigator: {
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                        '(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
                }
            });
            expect(util.isMobileDevice()).toBe(false);

            // Reset the window.
            setWindow(window);

        });
    });

    describe('isError', function() {
        it('should not assume objects are errors', function() {
            let fakeError = { message: 'A fake error', stack: 'no stack here' };
            expect(util.isError(fakeError)).toBe(false);
        });

        it('should detect simple error instances', function() {
            expect(util.isError(new Error())).toBe(true);
        });
    });

    describe('isDefined', function() {
        it('should detect undefined variables', function() {
            let obj = { id: 1 };
            expect(util.isDefined(obj.id)).toBe(true);
            expect(util.isDefined(obj.name)).toBe(false);
        });
    });

    describe('format string', function() {
        it('should merge arguments', function() {
            expect(util.formatString('abc{0}', '123')).toBe('abc123');
            expect(util.formatString('abc{0}', 1)).toBe('abc1');
            expect(util.formatString('abc{0}', false)).toBe('abcfalse');
        });

        it('should merge multiple arguments', function() {
            expect(util.formatString('abc{0}{1}', '123', 2)).toBe('abc1232');
            expect(util.formatString('{1}abc{0}', 1, 2)).toBe('2abc1');
            expect(util.formatString('a{0}bc{1}', false, true)).toBe('afalsebctrue');
        });

        it('should not merge undefined variables', function() {
            let obj = { id: 1 };
            expect(util.formatString('abc{0}', obj.name)).toBe('abc');
        });
    });

});
