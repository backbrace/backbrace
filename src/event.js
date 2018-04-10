/**
 * Event module. Allows events to be defined and subscribed to.
 * @module event
 * @private
 */
'use strict';

var $code = require('./code'),
    event = {};

function exists(name) {
    return event[name] !== null && typeof event[name] !== 'undefined';
}

function unbind(name) {
    event[name] = null;
}

function bind(name, handler, clear) {
    if (clear)
        unbind(name);
    event[name] = event[name] || [];
    event[name].push(handler);
}

function fireWait() {

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
}

function fire() {

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

module.exports = {
    exists: exists,
    bind: bind,
    unbind: unbind,
    fireWait: fireWait,
    fire: fire
};
