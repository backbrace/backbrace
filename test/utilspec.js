'use strict';

jumpstart(function(scope) {

    var $util = scope.util,
        $window = scope.window.get();

    describe('util module', function() {

        describe('isDefined', function() {

            it('should detect if a reference is defined', function() {
                var obj = {foo:'bar'};
                expect($util.isDefined(obj)).toBe(true);
                expect($util.isDefined(obj.foo)).toBe(true);
            });

            it('should detect if a reference is not defined', function() {
                var obj = {foo:'bar'};
                expect($util.isDefined(obj.bar)).toBe(false);
            });

        });

        describe('isError', function() {

            it('should detect error references', function() {
                expect($util.isError(new Error())).toBe(true);
            });

            it('should detect exception references', function() {
                try {
                    $window.document.querySelectorAll('');
                } catch (e) {
                    expect($util.isError(e)).toBe(true);
                }
            });

            it('should not detect an error from an object reference', function() {
                var err = { message: 'Not an error', stack: 'Not a call stack' };
                expect($util.isError(err)).toBe(false);
            });

        });

        describe('isString', function() {

            it('should detect string references', function() {
                var s = 'ABC';
                expect($util.isString('ABC')).toBe(true);
                expect($util.isString(s)).toBe(true);
                expect($util.isString(1)).toBe(false);
                expect($util.isString(true)).toBe(false);
                expect($util.isString($util.noop)).toBe(false);
                expect($util.isString({})).toBe(false);
                expect($util.isString([])).toBe(false);
            });

        });

    });

});
