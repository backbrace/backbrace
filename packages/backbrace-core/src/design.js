/**
 * Design module. Get object designs from cache, JSON files or data.
 * @module design
 * @private
 */

import $ from 'jquery';
import { promiseblock } from './promises';
import { get } from './http';
import { settings } from './settings';
import * as types from './types';

const defaults = {
    /** @type {pageDesign} */
    page: types.pagedesign,
    /** @type {pageFieldDesign} */
    pagefield: types.pagefield,
    /** @type {pageActionDesign} */
    pageaction: types.pageaction,
    /** @type {pageSectionDesign} */
    pagesection: types.pagesection,
    /** @type {tableDesign} */
    table: types.tabledesign,
    /** @type {tableColumnDesign} */
    tablecolumn: types.tablecolumn
};

/**
 * @ignore
 * @type {Map<string, pageDesign>}
 */
let pagecache = new Map();

/**
 * @ignore
 * @type {Map<string, tableDesign>}
 */
let tablecache = new Map();

/**
 * Get page object design.
 * @param {string} name Name of the page to get.
 * @returns {JQueryPromise} Promise to get the page design.
 */
export function page(name) {

    return promiseblock(

        // Get the page from a JSON file.
        () => {
            if (pagecache.has(name))
                return pagecache.get(name);
            return get(settings.dir.design + name + '.json');
        },

        (/** @type {pageDesign} */json) => {

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
 * Get table object design.
 * @param {string} name Name of the table to get.
 * @returns {JQueryPromise} Promise to get the table design.
 */
export function table(name) {

    return promiseblock(

        // Get the table from a JSON file.
        () => {
            if (tablecache.has(name))
                return tablecache.get(name);
            return get(settings.dir.design + name + '.json');
        },

        (/** @type {tableDesign} */json) => {

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
