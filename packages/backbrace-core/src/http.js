/**
 * Send various HTTP requests.
 * @module http
 * @private
 */

import $ from 'jquery';
import { error } from './error';

/**
 * Send a HTTP get request.
 * @method get
 * @memberof module:backbrace
 * @param {string} url Absolute or relative URL to get.
 * @returns {JQueryPromise} This `JQueryPromise` will return the data from the `url`. If the `url` is not
 * found, it will return `null`.
 */
export function get(url) {

    const d = $.Deferred();

    $.get({
        url: url,
        cache: true
    }).then(function(data) {
        d.resolve(data);
    }).fail(function(xhr, status, err) {
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

    let d = $.Deferred();

    $.post(url, function(data) {
        d.resolve(data);
    }).fail(function(xhr, status, err) {
        throw error('http')('post', xhr.responseText || err);
    });

    return d.promise();
}
