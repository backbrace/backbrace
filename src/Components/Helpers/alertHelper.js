'use strict';

/**
 * Alert helper. Used for displaying alerts. Includes a queue for the sweet alert library.
 */
var alertHelper = (function() {

    var queue = [],
        isOpen = false,
        isClosing = false,
        __swal = null;

    function swal() {
        openSwal(arguments);
    }

    function openSwal(config) {
        if (isOpen || isClosing) {
            queue.push(config);
        } else {
            __swal.apply(null, config);
            isOpen = true;
        }
    }

    function onClosed() {
        isClosing = false;
        if (queue.length)
            openSwal(queue.shift());
    }

    function fixMessage(msg) {

        $js.noThrow(function() {

            if (msg.message) {
                msg = msg.message;
            }
            msg = msg.replace(/\n/g, '<br />');
        });

        return msg;
    }

    return {

        /**
         * Initiate the alert helper. Overrides the close function on sweet alerts to allow
         *  queuing.
         */
        init: function() {

            //Save a local copy of the swal function.
            // @ts-ignore
            __swal = $window.swal;

            //Overwrite the close function.
            var originalClose = __swal.close;
            __swal.close = function() {
                isClosing = true;
                originalClose();
                isOpen = false;
                $window.setTimeout(function() {
                    onClosed();
                }, 400);
            };
        },

        /**
         * Basic alert. Queues the alert if an alert is already displayed.
         */
        alert: function(msg, callback, title, icon) {

            msg = fixMessage(msg);
            title = title || '';

            if (title.indexOf('Error') !== -1) {

                if (title === 'Application Error')
                    title = 'Oops';

                // @ts-ignore
                swal({
                    title: title,
                    text: msg,
                    type: 'error',
                    width: ($(window).width() < 438 ? $(window).width() - 60 : null)
                },
                    function() {
                        $js.noThrow(callback);
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

                // @ts-ignore
                swal({
                    title: title,
                    text: msg,
                    type: (icon ? null : type),
                    imageUrl: icon,
                    width: ($(window).width() < 438 ? $(window).width() - 60 : null)
                },
                    function() {
                        $js.noThrow(callback);
                    });
            }
        }
    };

})();
