// Examples from: https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet

import * as sanitize from '../src/sanitize';
import { get as getWindow } from '../src/providers/window';

describe('sanitize', function() {

    describe('decode html', function() {
        it('should unescape text', function() {
            expect(sanitize.decode('a&lt;div&gt;&amp;&lt;/div&gt;c')).toBe('a<div>&</div>c');
        });

        it('should preserve whitespace', function() {
            expect(sanitize.decode('  a&amp;b ')).toBe('  a&b ');
        });
    });

    describe('xss filter', function() {

        const window = getWindow();

        // Wait to catch any xss in the DOM...
        function waitForDOM(done) {
            window.setTimeout(function() {
                expect(window.alert).not.toHaveBeenCalled();
                done();
            }, 500);
        }

        beforeEach(function() {
            spyOn(window, 'alert');
        });

        it('should filter xss locator', function(done) {

            //Unencoded.
            let input = '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//";' +
                'alert(String.fromCharCode(88,83,83))//--></SCRIPT>">\'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>',
                output = '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//";' +
                    'alert(String.fromCharCode(88,83,83))//--&gt;"&gt;\'&gt;';

            expect(sanitize.filter(input)).toBe(output);

            //Encoded.
            input = '&#39;;alert(String.fromCharCode(88,83,83))//&#39;;alert(String.fromCharCode(88,83,83))//&quot;;alert(String.fromCharCode(88,83,83))//&quot;;' +
                'alert(String.fromCharCode(88,83,83))//--&gt;&lt;/SCRIPT&gt;&quot;&gt;&#39;&gt;&lt;SCRIPT&gt;alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;';
            expect(sanitize.filter(input)).toBe(output);

            waitForDOM(done);
        });

        it('should filter xss locator (short)', function(done) {

            //Unencoded.
            let input = '\'\';!--"<XSS>=&{()}',
                output = '\'\';!--"';

            expect(sanitize.filter(input)).toBe(output);

            //Encoded.
            input = '&#39;&#39;;!--&quot;&lt;XSS&gt;=&amp;{()}';
            expect(sanitize.filter(input)).toBe(output);

            waitForDOM(done);
        });

        it('should filter on error alert', function(done) {

            //Unencoded.
            let input = '<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>',
                output = '<img src="/">';

            expect(sanitize.filter(input)).toBe(output);

            //Encoded.
            input = '&lt;IMG SRC=/ onerror=&quot;alert(String.fromCharCode(88,83,83))&quot;&gt;&lt;/img&gt;';
            expect(sanitize.filter(input)).toBe(output);

            waitForDOM(done);
        });

    });

});
