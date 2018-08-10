import { error } from '../../app';
import * as packagemanager from '../../packagemanager';
import { findInput, isMobileDevice } from '../../util';
import { get as getIcons } from '../../providers/icons';
import { get as getJQuery } from '../../providers/jquery';
import { PageComponent } from '../../classes/pagecomponent';

/**
 * @class
 * @extends {PageComponent}
 * @description
 * List component.
 */
export class ListPageComponent extends PageComponent {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     */
    constructor(viewer) {

        super(viewer);

        /**
         * @description
         * Grid control.
         * @type {JQuery}
         */
        this.grid = null;

        /**
         * @description
         * Column names.
         * @type {string[]}
         */
        this.colNames = [];

        /**
         * @description
         * JQGrid columns.
         * @type {JQueryJqGridColumn[]}
         */
        this.columns = [];
    }

    /**
     * @description
     * Load the component.
     * @returns {Component} Returns itself for chaining.
     */
    load() {

        const $ = getJQuery();

        /**
         * @ignore
         * @description
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
         * @ignore
         * @description
         * Custom value handler.
         * @param {HTMLElement} elem Cell input element.
         * @param {string} op Update operation.
         * @param {*} value New value.
         * @returns {*} Returns the new value.
         */
        function customValue(elem, op, value) {
            const $ = getJQuery(),
                editor = findInput($(elem));
            if (op === 'set' && editor) {
                editor.val(value);
            }
            if (!editor)
                return null;
            return editor.val();
        }

        /**
         * @ignore
         * @description
         * On key press event handler for cell editors.
         * @param {JQuery.Event} ev Key press event.
         * @returns {boolean} Returns `false` to cancel bubbling.
         */
        function onKeyPress(ev) {
            ev.preventDefault();
            return false;
        }

        /**
         * @ignore
         * @description
         * Add a column to the grid.
         * @param {PageFieldMeta} field Page field meta data.
         * @returns {void}
         */
        let addColumn = (field) => {

            if (field.hidden) return;

            const caption = field.caption;

            this.colNames.push(caption);

            this.columns.push({
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
                /*eslint-disable camelcase*/
                editoptions: {
                    custom_element: (value, options) => {

                        value = mandatoryRevert(value);

                        let span = $('<span>'),
                            Control = require(`../fieldcomponents/textfield`).default,
                            cont = new Control(this, field);

                        cont.load(span);
                        cont.control.val(value);
                        cont.control.keydown(function(ev) {
                            return onKeyPress(ev);
                        });

                        window.setTimeout(function() {
                            cont.control.focus();
                        }, 50);

                        return span;
                    },
                    custom_value: customValue
                }
                /*eslint-enable camelcase*/
            });
        };

        // Load the jqgrid package (for desktop).
        packagemanager.add('jqgrid');
        packagemanager.load(() => {

            this.viewer.window.main.addClass('list-component');

            // Add the rowid column (desktop only).
            if (!isMobileDevice()) {

                this.colNames.push(' ');
                this.columns.push({
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
                    formatter: (cellvalue, options, rowObject) => {
                        const icons = getIcons();
                        let temp = false;
                        if (this.viewer.options.temp)
                            temp = true;
                        if (rowObject.NewRecord && !temp) {
                            return icons.get('%new%');
                        }
                        return cellvalue;
                    }
                });

                $.each(this.viewer.page.sections, function(i, section) {
                    $.each(section.fields, function(j, field) {
                        addColumn(field);
                    });
                });

                // Create the grid.
                this.grid = $('<table style="border: none"></table>');
                this.container = $('<div class="grid-container" />')
                    .append(this.grid)
                    .appendTo(this.viewer.window.main);

                this.grid.jqGrid({
                    datatype: 'local',
                    data: [],
                    autowidth: true,
                    height: 'auto',
                    width: null,
                    colNames: this.colNames,
                    colModel: this.columns,
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

                this.grid.addRowData('RowId', [{ 'RowId': 1, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
                this.grid.addRowData('RowId', [{ 'RowId': 2, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
                this.grid.addRowData('RowId', [{ 'RowId': 3, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
                this.grid.addRowData('RowId', [{ 'RowId': 4, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
                this.grid.addRowData('RowId', [{ 'RowId': 5, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);
                this.grid.addRowData('RowId', [{ 'RowId': 6, 'Field 1': 'Test', 'Field 2': 'Test 2' }]);

            } else {

                // Create the grid.
                this.grid = $('<table style="border: none"></table>');
                this.container = $('<div />')
                    .append(this.grid)
                    .appendTo(this.viewer.window.main);

            }

        }, function() {
            let url = this.src || this.href || '';
            error('Unable to load ' + url);
        });

        return this;
    }
}

export default ListPageComponent;
