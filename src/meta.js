/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module
 */
'use strict';

var $code = require('./code'),
    $settings = require('./settings'),
    $http = require('./http');

/**
 * Get page object meta data.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page meta data.
 */
function page(name) {
    return $code.block(
        function() {
            // Get the page from a JSON file.
            return $http.get($settings.meta.dir + 'pages/' + name + '.json');
        }
    );
}

module.exports = {
    page: page
};
