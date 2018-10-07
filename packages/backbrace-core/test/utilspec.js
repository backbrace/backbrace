import * as util from '../src/util';
import { loadScript } from '../src/packagemanager';
import { get as getJQuery } from '../src/providers/jquery';
import { get as getWindow, set as setWindow } from '../src/providers/window';

import { settings } from '../src/settings';

beforeAll(function() {
    settings.packages = '../../base/packages/backbrace-packages/dist';
});

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

    describe('extend', function() {
        it('should copy the properties of the source object onto the destination object',
            function() {
                let destination, source;
                destination = {};
                source = { foo: true };
                destination = util.extend(destination, source);
                expect(util.isDefined(destination.foo)).toBe(true);
            });

        it('should copy the length property of an object source to the destination object',
            function() {
                let destination, source;
                destination = {};
                source = { radius: 30, length: 0 };
                destination = util.extend(destination, source);
                expect(util.isDefined(destination.length)).toBe(true);
                expect(util.isDefined(destination.radius)).toBe(true);
            });

        it('should copy dates by reference', function() {
            let src = { date: new Date() };
            let dst = {};

            util.extend(dst, src);

            expect(dst.date).toBe(src.date);
        });
    });

    describe('forEach', function() {
        it('should iterate over *own* object properties', function() {
            function MyObj() {
                this.bar = 'barVal';
                this.baz = 'bazVal';
                this.length = 3;
            }
            MyObj.prototype.foo = 'fooVal';

            let obj = new MyObj(),
                log = [];

            util.forEach(obj, function(value, key) { log.push(key + ':' + value); });

            expect(log).toEqual(['bar:barVal', 'baz:bazVal', 'length:3']);
        });

        it('should not break if obj is an array we override hasOwnProperty', function() {
            let obj = [];
            obj[0] = 1;
            obj[1] = 2;
            obj.hasOwnProperty = null;
            let log = [];
            util.forEach(obj, function(value, key) {
                log.push(key + ':' + value);
            });
            expect(log).toEqual(['0:1', '1:2']);
        });

        it('should handle arguments objects like arrays', function() {
            let args,
                log = [];

            (function() { args = arguments; })('a', 'b', 'c');

            util.forEach(args, function(value, key) { log.push(key + ':' + value); });
            expect(log).toEqual(['0:a', '1:b', '2:c']);
        });

        it('should handle string values like arrays', function() {
            let log = [];

            util.forEach('bar', function(value, key) { log.push(key + ':' + value); });
            expect(log).toEqual(['0:b', '1:a', '2:r']);
        });

        it('should handle objects with length property as objects', function() {
            let obj = {
                'foo': 'bar',
                'length': 2
            },
                log = [];

            util.forEach(obj, function(value, key) { log.push(key + ':' + value); });
            expect(log).toEqual(['foo:bar', 'length:2']);
        });

        it('should handle objects of custom types with length property as objects', function() {
            function CustomType() {
                this.length = 2;
                this.foo = 'bar';
            }

            let obj = new CustomType(),
                log = [];

            util.forEach(obj, function(value, key) { log.push(key + ':' + value); });
            expect(log).toEqual(['length:2', 'foo:bar']);
        });

        it('should not invoke the iterator for indexed properties which are not present in the collection', function() {
            let log = [];
            let collection = [];
            collection[5] = 'SPARSE';
            util.forEach(collection, function(item, index) {
                log.push(item + index);
            });
            expect(log.length).toBe(1);
            expect(log[0]).toBe('SPARSE5');
        });

        it('should safely iterate through objects with no prototype parent', function() {
            let obj = util.extend(Object.create(null), {
                a: 1, b: 2, c: 3
            });
            let log = [];
            let self = {};
            util.forEach(obj, function(val, key, collection) {
                expect(this).toBe(self);
                expect(collection).toBe(obj);
                log.push(key + '=' + val);
            }, self);
            expect(log.length).toBe(3);
            expect(log).toEqual(['a=1', 'b=2', 'c=3']);
        });

        it('should safely iterate through objects which shadow Object.prototype.hasOwnProperty', function() {
            let obj = {
                length: 5,
                hasOwnProperty: true,
                a: 1,
                b: 2,
                c: 3
            };
            let log = [];
            let self = {};
            util.forEach(obj, function(val, key, collection) {
                expect(this).toBe(self);
                expect(collection).toBe(obj);
                log.push(key + '=' + val);
            }, self);
            expect(log.length).toBe(5);
            expect(log).toEqual(['length=5', 'hasOwnProperty=true', 'a=1', 'b=2', 'c=3']);
        });
    });

    describe('setZeroTimeout', function() {
        it('should run a function async', function(done) {
            util.setZeroTimeout(function() {
                done();
            });
        });
    });

    describe('addElement', function() {
        it('should add an element to the dom', function(done) {
            loadScript('jquery', function() {

                const $ = getJQuery(),
                    window = getWindow();
                let id = util.uid();

                util.addElement('div', {
                    id: id,
                    custom: '123'
                }, window.document.body);

                let ele = $('#' + id);
                expect(ele.length).toBe(1);
                expect(ele.attr('custom')).toBe('123');
                expect(ele.parent().is('body')).toBe(true);
                ele.remove();
                done();
            });
        });
    });

});
