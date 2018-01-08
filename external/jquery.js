/**
 * Module wrapper for the jQuery library. If it isn't loaded yet, it will return `null`.
 * @module
 */
'use strict';

/* global jQuery:false */

/** @type {JQueryStatic<HTMLElement>} */

function getJquery() {
    return (typeof jQuery !== 'undefined' ? jQuery : null);
}

module.exports = getJquery;
