/**
 * Send various HTTP requests.
 * @module http
 * @private
 */

import { error } from './error';
import { get as getJQuery } from './providers/jquery';

/**
 * Send a HTTP get request.
 * @method get
 * @memberof module:backbrace
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
 * @method post
 * @memberof module:backbrace
 * @param {string} url Absolute or relative URL to get.
 * @returns {JQueryPromise} This `JQueryPromise` will return the data from the `url`.
 */
export function post(url) {

    const $ = getJQuery();

    let d = $.Deferred();

    $.post(url, function(data) {
        d.resolve(data);
    }).fail(function(xhr, status, err) {
        throw error('http')('post', xhr.responseText || err);
    });

    return d.promise();
}
