/**
 * Meta data module. Get object meta data from cache, JSON files or data.
 * @module meta
 * @private
 */

import $ from 'jquery';
import { error } from './error';
import { promiseblock } from './promises';
import { get } from './http';
import { settings } from './settings';
import * as types from './types';

const defaults = {
    /** @type {pageMeta} */
    page: types.pagemeta,
    /** @type {pageFieldMeta} */
    pagefield: types.pagefield,
    /** @type {pageActionMeta} */
    pageaction: types.pageaction,
    /** @type {pageSectionMeta} */
    pagesection: types.pagesection,
    /** @type {tableMeta} */
    table: types.tablemeta,
    /** @type {tableColumnMeta} */
    tablecolumn: types.tablecolumn
},
    metaError = error('meta');

/**
 * @type {Map<string, pageMeta>}
 * @private
 */
let pagecache = new Map();

/**
 * @type {Map<string, tableMeta>}
 * @private
 */
let tablecache = new Map();

/**
 * Add a page to the page cache.
 * @param {string} name Name of the page.
 * @param {pageMeta} pge Page meta.
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
 * @param {tableMeta} tbl Table meta.
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

    return promiseblock(

        // Get the page from a JSON file.
        () => {
            if (pagecache.has(name))
                return pagecache.get(name);
            return get(settings.meta.dir + name + '.json');
        },

        (/** @type {pageMeta} */json) => {

            if (!json)
                return null;

            if (!pagecache.has(name))
                pagecache.set(name, json);

            // Merge the json with default values.
            json.caption = json.caption || json.name;

            // Extend the page.
            let pge = $.extend({}, defaults.page, json);

            // Extend the page sections.
            pge.sections = [];
            (json.sections || []).forEach(function(section) {

                section.text = section.text || section.name;
                pge.sections.push($.extend({}, defaults.pagesection, section));

                // Extend the page section fields.
                $.each(section.fields, function(index, field) {
                    field.caption = field.caption || field.name;
                    section.fields[index] = $.extend({}, defaults.pagefield, field);
                });

                // Extend the page section actions.
                $.each(section.actions, function(index, action) {
                    action.text = action.text || action.name;
                    section.actions[index] = $.extend({}, defaults.pageaction, action);
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

    return promiseblock(

        // Get the table from a JSON file.
        () => {
            if (tablecache.has(name))
                return tablecache.get(name);
            return get(settings.meta.dir + name + '.json');
        },

        (/** @type {tableMeta} */json) => {

            if (!json)
                return null;

            if (!tablecache.has(name))
                tablecache.set(name, json);

            // Extend the table.
            let tbl = $.extend({}, defaults.table, json);

            // Extend the table columns.
            tbl.columns = [];
            (json.columns || []).forEach(function(column) {
                column.caption = column.caption || column.name;
                tbl.columns.push($.extend({}, defaults.tablecolumn, column));
            });

            return tbl;
        }
    );
}
