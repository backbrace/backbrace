/**
 * Send various HTTP requests.
 * @module $http
 *
 * @description
 * ### Overview
 * The `$http` module is used to send various types of HTTP requests (like `GET,POST`,etc).
 *
 * The `$http` module is simply a wrapper for the
 * [JQuery AJAX api](http://api.jquery.com/jquery.ajax). The JQuery AJAX calls are wrapped in a
 * `JQueryPromise` so we can inject these functions directly into a `$code.block`.
 *
 * ### General use
 * ```js
 *  // Simple GET request with a $code.block:
 *  return $code.block(
 *      function(){
 *          return $http.get('/someurl');
 *      },
 *      function(data){
 *          // data from the GET request. NOTE: If the request
 *          // failed, data will be `null`
 *      }
 *  );
 * ```
 */
'use strict';

var $ = require('../external/jquery')();

/**
 * Send a HTTP get request.
 * @memberof module:$http
 * @param {string} url Absolute or relative URL to get.
 * @returns {JQueryPromise} This `JQueryPromise` will return the data from the `url`. If the `url` is not
 * found, it will return `null`.
 */
function get(url) {

    $ = $ || require('../external/jquery')();

    var d = $.Deferred();

    $.get(url, function(data) {
        d.resolve(data);
    }).fail(function() {
        d.resolve(null);
    });

    return d.promise();
}

module.exports = {
    get: get
};

