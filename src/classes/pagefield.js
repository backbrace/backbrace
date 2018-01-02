'use strict';

var $util = require('../util');

/**
 * Page Field class.
 * @param {*} properties Properties for the new page field.
 * @class
 */
function PageField(properties) {

    this.name = '';
    this.caption = '';
    this.editable = false;
    this.type = '';
    this.width = 0;
    this.tabName = '';
    this.fieldMask = '';
    this.tooltip = '';
    this.hidden = false;
    this.incrementDelta = 0;
    this.totals = false;
    this.customComponent = '';
    this.sort = 0;
    this.optionString = '';
    this.optionCaption = '';
    this.onValidate = '';
    this.onLookup = '';
    this.lookupTable = '';
    this.lookupField = '';
    this.lookupFilters = '';
    this.lookupColumns = '';
    this.lookupCategoryField = '';
    this.lookupDisplayField = '';

    if (typeof properties !== 'undefined') {
        // Extend the page field.
        $util.extend(this, properties);
    }
}

module.exports = PageField;
