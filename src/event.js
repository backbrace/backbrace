/**
 * Event module. Allows events to be defined and subscribed to.
 * @module
 */
'use strict';

var $code = require('./code'),
    $window = require('./window').get(),
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

// Setup default events.
bind('js.message', function(msg, callback, title) {

    // Show a simple alert.
    $window.alert(msg);
    if (callback)
        callback();
});

bind('js.confirm', function(msg, callback, title, yescaption, nocaption) {

    // Show a simple confirmation.
    var ret = $window.confirm(msg);
    if (callback)
        callback(ret);
});

bind('js.error', function(msg) {

    // Add error to body if it is loaded...
    if ($window.document.body) {
        $window.document.body.innerHTML = '<div style="padding: 30px; ' +
            'overflow-wrap: break-word;"><h1>Oops, we had an issue</h1>' + msg + '</div>';
    } else {
        $window.alert(msg);
    }
});

module.exports = {
    exists: exists,
    bind: bind,
    unbind: unbind,
    fireWait: fireWait,
    fire: fire
};
