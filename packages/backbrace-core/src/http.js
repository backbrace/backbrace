/**
 * Send various HTTP requests.
 * @module http
 * @private
 */

import $ from 'jquery';
import { error } from './error';

/**
 * Send a HTTP get request.
 * @async
 * @template T
 * @param {string} url Absolute or relative URL to get.
 * @param {string} [dataType] Set the dataType header.
 * @returns {Promise<T>} Returns the data from the `url`. If the `url` is not
 * found, it will return `null`.
 */
export async function get(url, dataType) {

    return new Promise(resolve => {

        $.get({
            url: url,
            cache: true,
            dataType: dataType
        }).then(data => {
            resolve(data);
        }).fail(() => {
            resolve(null);
        });

    });
}

/**
 * Send a HTTP post request.
 * @async
 * @template T
 * @param {string} url Absolute or relative URL to get.
 * @returns {Promise<T>} Returns the data from the `url`.
 */
export async function post(url) {

    return new Promise(resolve => {

        $.post(url, (data) => {
            resolve(data);
        }).fail(function(xhr, status, err) {
            throw error('http')('post', xhr.responseText || err);
        });

    });
}
