/**
 * Sweet alert module. Includes a queue for the sweet alert library.
 * @module
 */
'use strict';

var $util = require('./util'),
    $window = require('./window').get(),
    swal = require('../external/swal'),
    queue = [],
    isOpen = false,
    isClosing = false,
    originalClose = swal.close;

//Overwrite the close function.
swal.close = function() {
    isClosing = true;
    originalClose();
    isOpen = false;
    $window.setTimeout(function() {
        onClosed();
    }, 400);
};

/**
 * Open a sweet alert or queue it if one is already open.
 */
function openSwal() {
    if (isOpen || isClosing) {
        queue.push(arguments);
    } else {
        swal.apply(null, arguments);
        isOpen = true;
    }
}

/**
 * Sweetalert close event.
 */
function onClosed() {
    isClosing = false;
    if (queue.length)
        openSwal.apply(null, queue.shift());
}

/**
 * Fix alert messages.
 */
function fixMessage(msg) {

    $util.noThrow(function() {
        if (msg.message) {
            msg = msg.message;
        }
        msg = msg.replace(/\n/g, '<br />');
    });

    return msg;
}

/**
 * Shows a sweet alert. Queues the alert if an alert is already displayed.
 */
function show(msg, callback, title, icon) {

    msg = fixMessage(msg);
    title = title || '';

    if (title.indexOf('Error') !== -1) {

        if (title === 'Application Error')
            title = 'Oops';

        openSwal({
            title: title,
            text: msg,
            type: 'error',
            width: ($util.width() < 438 ? $util.width() - 60 : null)
        },
            function() {
                $util.noThrow(callback);
            });

    } else {

        var type = 'warning';
        if (msg.toLowerCase().indexOf('done') !== -1 ||
            msg.toLowerCase().indexOf('success') !== -1 ||
            title.toLowerCase().indexOf('done') !== -1 ||
            title.toLowerCase().indexOf('success') !== -1)
            type = 'success';

        if (title === 'Application Message')
            title = '';

        openSwal({
            title: title,
            text: msg,
            type: (icon ? null : type),
            imageUrl: icon,
            width: ($util.width() < 438 ? $util.width() - 60 : null)
        },
            function() {
                $util.noThrow(callback);
            });
    }
}

module.exports = {
    show: show
};
