'use strict';

var $util = require('../util');

/**
 * Page Action class.
 * @class
 * @private
 * @param {*} properties Properties for the new page action.
 */
function PageAction(properties) {

    this.name = '';
    this.text = '';
    this.type = '';
    this.icon = '';
    this.classname = '';
    this.recordRequired = false;
    this.pageName = '';
    this.pageView = '';
    this.reload = false;
    this.reloadParent = false;
    this.onDoubleClick = false;

    if (typeof properties !== 'undefined') {
        // Extend the page action.
        $util.extend(this, properties);
        this.text = this.text || this.name;
    }
}

module.exports = PageAction;
