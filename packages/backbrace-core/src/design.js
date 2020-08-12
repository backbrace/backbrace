import jsyaml from 'js-yaml';

import { settings } from './settings';
import * as types from './types';

import { get as getWindow } from './providers/window';

/**
 * Design module. Get object designs from JSON files.
 * @module design
 * @private
 */

/**
 * Default types.
 * @ignore
 */
const defaults = {
    /** @type {import('./types').pageDesign} */
    page: types.pagedesign,
    /** @type {import('./types').pageFieldDesign} */
    pagefield: types.pagefield,
    /** @type {import('./types').pageActionDesign} */
    pageaction: types.pageaction,
    /** @type {import('./types').pageSectionDesign} */
    pagesection: types.pagesection
};

/**
 * Get page object design.
 * @async
 * @param {string} name Name of the page to get.
 * @returns {Promise<import('./types').pageDesign>}
 */
export async function page(name) {

    const window = getWindow();

    // Get the page from a JSON file.
    let d = await window.fetch(settings.dir.design + name);

    if (!d.ok)
        return null;

    /**
     * @ignore
     * @type {import('./types').pageDesign}
     */
    let json = null;

    // Convert yaml to an object.
    if (name.endsWith('.yaml') || name.endsWith('.yml')) {
        json = jsyaml.load(await d.text());
    } else {
        json = await d.json();
    }

    // Extend the page.
    const pge = Object.assign({}, defaults.page, json);

    // Extend the page sections.
    pge.sections = [];
    (json.sections || []).forEach((section) => {

        section.caption = section.caption || section.name;

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
