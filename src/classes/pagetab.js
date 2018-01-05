'use strict';

var $util = require('../util');

/**
 * Page Tab class.
 * @class
 * @private
 * @param {*} properties Properties for the new page tab.
 */
function PageTab(properties) {

    this.name = '';
    this.text = '';
    this.pageName = '';
    this.pageView = '';
    this.options = '';

    if (typeof properties !== 'undefined') {
        // Extend the page tab.
        $util.extend(this, properties);
        this.text = this.text || this.name;
    }
}

module.exports = PageTab;
