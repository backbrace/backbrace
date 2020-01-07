/**
 * Design module. Get object designs from JSON files.
 * @module design
 * @private
 */

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
    pagesection: types.pagesection
};

/**
 * Get page object design.
 * @async
 * @param {string} name Name of the page to get.
 * @returns {Promise<pageDesign>} Promise to get the page design.
 */
export async function page(name) {

    // Get the page from a JSON file.
    /** @type {pageDesign} */
    const json = await get(settings.dir.design + name + '.json');

    if (!json)
        return null;

    // Merge the json with default values.
    json.caption = json.caption || json.name;

    // Extend the page.
    const pge = Object.assign({}, defaults.page, json);

    // Extend the page sections.
    pge.sections = [];
    (json.sections || []).forEach((section) => {

        section.text = section.text || section.name;
        pge.sections.push(Object.assign({}, defaults.pagesection, section));

        // Extend the page section fields.
        (section.fields || []).forEach((field, index) => {
            field.caption = field.caption || field.name;
            section.fields[index] = Object.assign({}, defaults.pagefield, field);
        });

        // Extend the page section actions.
        (section.actions || []).forEach((action, index) => {
            action.text = action.text || action.name;
            section.actions[index] = Object.assign({}, defaults.pageaction, action);
        });
    });

    return pge;
}
