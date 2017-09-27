'use strict';

/**
 * Table column object.
 * @param {*} properties - Properties for the new column.
 */
function Column(properties) {

    this.name = '';
    this.type = '';
    this.size = 0;
    this.decimalPlaces = '';
    this.primaryKey = false;
    this.modified = true;
    this.caption = '';
    this.codeField = '';
    this.optionString = '';
    this.optionCaption = '';
    this.lookupTable = '';
    this.lookupField = '';
    this.lookupFilters = '';
    this.lookupColumns = '';
    this.lookupCategoryField = '';
    this.lookupDisplayField = '';
    this.options = '';

    // Extend the column.
    if (typeof properties !== 'undefined')
        $js.extend(this, properties);
}

/**
 * Table object.
 * @param {*} properties - Properties for the new table.
 */
function Table(properties) {

    var _self = this;

    /** @type {Column[]} */
    this.columns = [];
    /** @type {string[][]} */
    this.keys = [];

    if (typeof properties !== 'undefined') {

        // Extend the table.
        $js.extend(this, properties);

        // Extend the table columns.
        this.columns = [];
        $js.forEach(properties.columns, function(column) {
            _self.columns.push(new Column(column));
        });
    }
}
