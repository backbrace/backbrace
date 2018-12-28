/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module meta
 * @private
 */

import { error } from './error';
import { promiseblock } from './promises';
import { get } from './http';
import { settings } from './settings';
import * as types from './types';
import { get as getJQuery } from './providers/jquery';

const defaults = {
    /** @type {PageMeta} */
    page: types.pagemeta,
    /** @type {PageFieldMeta} */
    pagefield: types.pagefield,
    /** @type {PageActionMeta} */
    pageaction: types.pageaction,
    /** @type {PageSectionMeta} */
    pagesection: types.pagesection,
    /** @type {TableMeta} */
    table: types.tablemeta,
    /** @type {TableColumnMeta} */
    tablecolumn: types.tablecolumn
},
    metaError = error('meta');

/**
 * @type {Map<string, PageMeta>}
 * @private
 */
let pagecache = new Map();

/**
 * @type {Map<string, TableMeta>}
 * @private
 */
let tablecache = new Map();

/**
 * Add a page to the page cache.
 * @param {string} name Name of the page.
 * @param {PageMeta} pge Page meta.
 * @returns {void}
 */
export function addPage(name, pge) {
    if (pagecache.has(name))
        metaError('exists', 'Page {0} already exists in the page cache.', name);
    pagecache.set(name, pge);
}

/**
 * Add a table to the table cache.
 * @param {string} name Name of the table.
 * @param {TableMeta} tbl Table meta.
 * @returns {void}
 */
export function addTable(name, tbl) {
    if (tablecache.has(name))
        metaError('exists', 'Table {0} already exists in the table cache.', name);
    tablecache.set(name, tbl);
}

/**
 * Get page object meta data.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page meta data.
 */
export function page(name) {

    const $ = getJQuery();

    return promiseblock(

        // Get the page from a JSON file.
        () => {
            if (pagecache.has(name))
                return pagecache.get(name);
            return get(settings.meta.dir + name + '.json');
        },

        (/** @type {PageMeta} */json) => {

            if (!json)
                return null;

            if (!pagecache.has(name))
                pagecache.set(name, json);

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

    return promiseblock(

        // Get the table from a JSON file.
        () => {
            if (tablecache.has(name))
                return tablecache.get(name);
            return get(settings.meta.dir + name + '.json');
        },

        (/** @type {TableMeta} */json) => {

            if (!json)
                return null;

            if (!tablecache.has(name))
                tablecache.set(name, json);

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
