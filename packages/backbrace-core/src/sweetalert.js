/**
 * Sweet alert module. Includes a queue for the sweet alert library.
 * @module sweetalert
 * @private
 */

import swal from 'sweetalert';
import 'npm/sweetalert/dist/sweetalert.css';

import { width } from './util';
import { get as getWindow } from './providers/window';

let queue = [],
    isOpen = false,
    isClosing = false,
    originalClose = null;

/**
 * Load the module.
 * @ignore
 * @returns {void}
 */
function load() {

    //Overwrite the close function.
    originalClose = swal.close;
    swal.close = function() {
        const window = getWindow();
        isClosing = true;
        originalClose();
        isOpen = false;
        window.setTimeout(function() {
            onClosed();
        }, 400);
    };
}

/**
 * Open a sweet alert or queue it if one is already open.
 * @ignore
 * @returns {void}
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
 * @ignore
 * @returns {void}
 */
function onClosed() {
    isClosing = false;
    if (queue.length)
        openSwal.apply(null, queue.shift());
}

/**
 * Fix alert messages.
 * @ignore
 * @param {string} msg Alert message to fix.
 * @returns {string} Alert message
 */
function fixMessage(msg) {

    // Replace new lines with line breaks.
    msg = msg.replace(/\n/g, '<br />');

    return msg;
}

/**
 * Shows a sweet alert. Queues the alert if an alert is already displayed.
 * @param {string} msg Message to display
 * @param {function():void} [callback] Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Confirmation"] Title of the dialog.
 * @param {string} [icon] Icon URL to display in the dialog.
 * @returns {void}
 */
export function show(msg, callback, title, icon) {

    // Load the module.
    if (originalClose === null)
        load();

    msg = fixMessage(msg);
    title = title || '';

    if (title.indexOf('Error') !== -1) {

        if (title === 'Application Error')
            title = 'Oops';

        openSwal({
            title: title,
            text: msg,
            type: 'error',
            width: (width() < 438 ? width() - 60 : null)
        },
            callback
        );

    } else {

        let type = 'warning';
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
            width: (width() < 438 ? width() - 60 : null)
        },
            callback
        );
    }
}
