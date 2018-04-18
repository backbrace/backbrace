'use strict';

var app = require('../app'),
    code = require('../code'),
    icons = require('../providers/icons').get(),
    packages = require('../packages'),
    packagemanager = require('../packagemanager'),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../../external/jquery'),
    PageComponent = require('./pagecomponent');

/**
 * List component.
 * @class
 * @private
 * @param {PageComponent} parent Parent page component.
 */
function ListComponent(parent) {
    this.id = util.nextID();
    /** @type {JQuery} */
    this.container = null;
    /** @type {JQuery} */
    this.grid = null;
    /** @type {string[]} */
    this.colNames = [];
    /** @type {JQueryJqGridColumn[]} */
    this.columns = [];
    this.parent = parent;
    this.subpages = {};
}

ListComponent.prototype.unload = function() {
    this.container.remove();
};

/**
 * Load the list component.
 * @returns {void}
 */
ListComponent.prototype.load = function() {

    var self = this;

    function packageError() {
        var url = this.src || this.href || '';
        app.error('Unable to load ' + url);
    }

    /**
     * Remove the mandatory placeholder.
     * @param {string} value Cell value.
     * @returns {string} Converted cell value.
     */
    function mandatoryRevert(value) {
        if (value && value.indexOf('Mandatory</span>') !== -1)
            return '';
        return value;
    }

    /**
     * Find the input editor.
     * @param {JQuery} elem Element to search.
     * @returns {JQuery} Returns the editor if found.
     */
    function findInput(elem) {

        for (var i = 0; i < elem.children().length; i++) {
            if (elem.children()[i].nodeName === 'INPUT'
                || elem.children()[i].nodeName === 'TEXTAREA') {
                if (elem.children()[i].className !== 'noinput')
                    return $(elem.children()[i]);
            }
            var v = findInput($(elem.children()[i]));
            if (v !== null)
                return v;
        }

        return null;
    }

    function customValue(elem, op, value) {
        var editor = findInput($(elem));
        if (op === 'set' && editor) {
            editor.val(value);
        }
        if (!editor)
            return null;
        return editor.val();
    }

    /**
     * Add a column to the grid.
     * @param {PageFieldMeta} field Page field meta data.
     * @returns {void}
     */
    function addColumn(field) {

        if (field.hidden) return;

        var caption = field.caption;

        self.colNames.push(caption);

        self.columns.push({
            name: field.name,
            index: field.name,
            width: field.width,
            editable: field.editable,
            hidden: false,
            sortable: true,
            sorttype: function(cellvalue) {
                if ((field.type === 'Integer' || field.type === 'Decimal')
                    && cellvalue && cellvalue !== '')
                    return parseFloat(cellvalue);
                return cellvalue;
            },
            edittype: 'custom',
            align: (field.type === 'Integer' || field.type === 'Decimal' ? 'right' : 'left'),
            formatter: function(cellvalue, options, rowObject) {
                return cellvalue;
            },
            editoptions: {
                custom_element: function(value, options) {

                    value = mandatoryRevert(value);

                    var Control = require('./controls/textboxcomponent'),
                        cont = new Control(self, field),
                        span = $('<span>');

                    code.thread(
                        function() {
                            cont.load(span);
                        },
                        function() {
                            cont.control.val(value);
                            cont.control.focus();
                        }
                    );

                    return span;
                },
                custom_value: customValue
            }
        });
    }

    // Load the jqgrid package (for desktop).
    packagemanager.add(packages.jqgrid());
    packagemanager.load(function() {

        self.parent.window.main.addClass('list-component');

        // Add the rowid column (desktop only).
        if (!settings.mobile) {

            self.colNames.push(' ');
            self.columns.push({
                name: 'RowId',
                index: 'RowId',
                width: '20px',
                fixed: true,
                editable: false,
                sortable: true,
                search: false,
                align: 'center',
                classes: 'row-id',
                hidedlg: true,
                formatter: function(cellvalue, options, rowObject) {
                    var temp = false;
                    if (self.parent.options.temp)
                        temp = true;
                    if (rowObject.NewRecord && !temp) {
                        return icons.get('plus-circle-outline');
                    }
                    return cellvalue;
                }
            });

            $.each(self.parent.page.fields, function(i, field) {
                addColumn(field);
            });

            // Create the grid.
            self.grid = $('<table style="border: none"></table>');
            self.container = $('<div class="grid-container" />')
                .append(self.grid)
                .appendTo(self.parent.window.main);

            self.grid.jqGrid({
                datatype: 'local',
                data: [],
                autowidth: true,
                height: 'auto',
                width: 'auto',
                colNames: self.colNames,
                colModel: self.columns,
                shrinkToFit: false,
                rowNum: 50000,
                pginput: false,
                viewrecords: true,
                cellEdit: true,
                multiselect: false,
                cellsubmit: 'clientArray',
                sortable: true,
                multiSort: true,
                scrollrows: true,
                autoencode: true
            });

            self.grid.addRowData('RowId', [{ 'RowId': 1, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
            self.grid.addRowData('RowId', [{ 'RowId': 2, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
            self.grid.addRowData('RowId', [{ 'RowId': 3, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
            self.grid.addRowData('RowId', [{ 'RowId': 4, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
            self.grid.addRowData('RowId', [{ 'RowId': 5, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
            self.grid.addRowData('RowId', [{ 'RowId': 6, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);

        } else {

            // Create the grid.
            self.grid = $('<table style="border: none"></table>');
            self.container = $('<div />')
                .append(self.grid)
                .appendTo(self.parent.window.main);

        }

    }, packageError);

};

ListComponent.prototype.show = function() {
    this.container.show();
};

ListComponent.prototype.hide = function() {
    this.container.hide();
};

module.exports = ListComponent;
