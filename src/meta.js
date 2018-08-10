/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module meta
 * @private
 */

import { codeblock } from './code';
import { get } from './http';
import { settings } from './settings';
import { get as getJQuery } from './providers/jquery';

const defaults = {
    /** @type {PageMeta} */
    page: {
        name: '',
        caption: '',
        component: 'cardpage',
        controller: '',
        tableName: '',
        icon: '',
        actions: [],
        sections: []
    },
    /** @type {PageFieldMeta} */
    pagefield: {
        name: '',
        caption: '',
        type: 'Text',
        component: '',
        width: '100px',
        editable: true,
        hidden: false,
        className: 's12 m6'
    },
    /** @type {PageActionMeta} */
    pageaction: {
        name: '',
        text: '',
        icon: '',
        iconColor: '',
        className: ''
    },
    /** @type {PageSectionMeta} */
    pagesection: {
        name: '',
        text: '',
        pageName: '',
        icon: '',
        className: '',
        fields: []
    },
    /** @type {TableMeta} */
    table: {
        name: '',
        controller: '',
        columns: []
    },
    /** @type {TableColumnMeta} */
    tablecolumn: {
        name: '',
        caption: '',
        type: 'Text'
    }
};

/**
 * Get page object meta data.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page meta data.
 */
export function page(name) {

    const $ = getJQuery();

    return codeblock(

        // Get the page from a JSON file.
        () => get(settings.meta.dir + 'pages/' + name + '.json'),

        (/** @type {PageMeta} */json) => {

            // Merge the json with default values.
            json.caption = json.caption || json.name;

            // Extend the page.
            let pge = $.extend({}, defaults.page, json);

            // Extend the page actions.
            pge.actions = [];
            $.each(json.actions, function(index, action) {
                action.text = action.text || action.name;
                pge.actions.push($.extend({}, defaults.pageaction, action));
            });

            // Extend the page sections.
            pge.sections = [];
            $.each(json.sections, function(index, section) {

                section.text = section.text || section.name;
                pge.sections.push($.extend({}, defaults.pagesection, section));

                // Extend the page section fields.
                $.each(section.fields, function(index, field) {
                    field.caption = field.caption || field.name;
                    section.fields[index] = $.extend({}, defaults.pagefield, field);
                });
            });

            return pge;
        }
    );
}

/**
 * Get table object meta data.
 * @param {string} name Name of the table to get.
 * @returns {JQueryPromise} Promise to get the table meta data.
 */
export function table(name) {

    const $ = getJQuery();

    return codeblock(

        // Get the table from a JSON file.
        () => get(settings.meta.dir + 'tables/' + name + '.json'),

        (/** @type {TableMeta} */json) => {

            // Extend the table.
            let tbl = $.extend({}, defaults.table, json);

            // Extend the table columns.
            tbl.columns = [];
            $.each(json.columns, function(index, column) {
                column.caption = column.caption || column.name;
                tbl.columns.push($.extend({}, defaults.tablecolumn, column));
            });

            return tbl;
        }
    );
}
