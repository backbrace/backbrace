'use strict';

jumpstart(function(scope) {

    var $util = scope.util;

    describe('util module', function() {

        describe('isString', function() {

            it('should determine string references', function() {
                var s = 'ABC';
                expect($util.isString('ABC')).toEqual(true);
                expect($util.isString(s)).toEqual(true);
                expect($util.isString(1)).toEqual(false);
                expect($util.isString(true)).toEqual(false);
                expect($util.isString($util.noop)).toEqual(false);
                expect($util.isString({})).toEqual(false);
                expect($util.isString([])).toEqual(false);
            });

        });

    });

});
