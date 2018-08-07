/**
 * Send various HTTP requests.
 * @module http
 * @private
 */

import { get as getJQuery } from './providers/jquery';

/**
 * Send a HTTP get request.
 * @param {string} url Absolute or relative URL to get.
 * @returns {JQueryPromise} This `JQueryPromise` will return the data from the `url`. If the `url` is not
 * found, it will return `null`.
 */
export function get(url) {

    const $ = getJQuery(),
        d = $.Deferred();

    $.get(url, function(data) {
        d.resolve(data);
    }).fail(function() {
        d.resolve(null);
    });

    return d.promise();
}

/**
 * Send a HTTP post request.
 * @param {string} url Absolute or relative URL to get.
 * @returns {JQueryPromise} This `JQueryPromise` will return the data from the `url`. If the `url` is not
 * found, it will return `null`.
 */
export function post(url) {

    const $ = getJQuery();

    let d = $.Deferred();

    $.post(url, function(data) {
        d.resolve(data);
    }).fail(function(xhr, status, error) {
        throw Error(xhr.responseText || error);
    });

    return d.promise();
}
