/**
 * Data module.
 * @module data
 * @private
 */

import { error } from './error';

const dataError = error('data');

/**
 * @ignore
 * @type {Map<string, any[]>}
 */
let dataTables = new Map();

/**
 * Add a data table.
 * @param {string} name Name of the table.
 * @returns {void}
 */
export function addDataTable(name) {
    if (dataTables.has(name))
        dataError('exists', 'Data table {0} already exists.', name);
    dataTables.set(name, []);
}

/**
 * Get a data table.
 * @param {string} name Name of the data table.
 * @returns {any[]} Returns the data table if found.
 */
export function dataTable(name) {
    if (!dataTables.has(name))
        dataError('notfound', 'Data table {0} was not found.', name);
    return dataTables.get(name);
}
