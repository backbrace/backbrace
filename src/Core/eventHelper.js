'use strict';

var $event = (function() {

    var event = {};

    return {

        exists: function(name) {
            return event[name] !== null && typeof event[name] !== 'undefined';
        },

        on: function(name, handler) {
            event[name] = event[name] || [];
            event[name].push(handler);
        },

        fireWait: function() {

            var slice = [].slice;

            var args = 2 <= arguments.length ? slice.call(arguments, 1) : [],
                handler,
                name = arguments[0];

            if (event[name] != null) {

                var ref = event[name];

                if (ref.length > 0)
                    return $code.loop(function(i) {

                        return $code.block(

                            function() {
                                handler = ref[i];
                                return handler.apply(null, args);
                            },

                            function() {
                                if (i < ref.length - 1)
                                    return $code.next;
                            }
                        );

                    });
            }
        },

        fire: function() {

            var slice = [].slice;

            var args = 2 <= arguments.length ? slice.call(arguments, 1) : [],
                handler,
                name = arguments[0];

            if (event[name] != null) {
                var ref = event[name];
                for (var i = 0; i < ref.length; i++) {
                    handler = ref[i];
                    if (ref.length === 1) {
                        return handler.apply(null, args);
                    } else {
                        handler.apply(null, args);
                    }
                }
            }
        }

    };

})();
