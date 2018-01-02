'use strict';

var $util = require('../util');

/**
 * Page Action class.
 * @param {*} properties Properties for the new page action.
 * @class
 */
function PageAction(properties) {

    this.name = '';
    this.type = '';
    this.onclick = null;
    this.icon = '';
    this.recordRequired = false;
    this.pageName = '';
    this.pageView = '';
    this.reload = false;
    this.reloadParent = false;
    this.onDoubleClick = false;

    if (typeof properties !== 'undefined') {
        // Extend the page action.
        $util.extend(this, properties);
    }
}

module.exports = PageAction;
