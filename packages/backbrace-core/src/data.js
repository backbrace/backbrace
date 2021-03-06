import { DateTime } from 'luxon';
import { settings } from './settings';
import { get as getWindow } from './providers/window';
import { appState } from './state';

/**
 * @module data
 * @private
 * @description
 * Data management.
 */

/**
 * Bind a datasource to a path.
 * @param {string} path Path to bind.
 * @param {unknown} data Data source.
 * @returns {unknown}
 */
export function bind(path, data) {
    let bindData = data;
    path.split('.').forEach((bprop) => {
        if (bindData === null || typeof bindData[bprop] === 'undefined')
            throw new Error(`Data binding failed for ${path} on property ${bprop}`);
        bindData = bindData[bprop];
    });
    return bindData;
}

/**
 * @async
 * @description
 * Get data from a data source.
 * @param {string} url Data url.
 * @param {string} url Data query.
 * @param {Object} [variables] Optional variables to pass to the query.
 * @returns {Promise<any>}
 */
export async function fetch(url, query, variables) {

    const window = getWindow();

    // Load from a JSON file.
    if (url.endsWith('.json')) {

        let res = await window.fetch(`${settings.dir.design}${url}`);
        if (res.ok) {
            return await res.json();
        }

    } else {

        let body = {};
        if (query)
            body.query = query;
        if (variables)
            body.variables = variables;

        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (appState.auth?.token)
            headers.Authorization = 'Bearer ' + appState.auth.token;

        let res = await window.fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        if (res.ok) {
            return await res.json();
        } else {
            return {
                errors: [
                    { message: res.statusText }
                ]
            };
        }
    }

    return null;
}

/**
 * Check if a string is in ISO Date format.
 * @param {string} str String to check.
 * @returns {boolean}
 */
function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    let d = new Date(str);
    return d.toISOString() === str;
}

/**
 * Format a data value to a string.
 * @param {unknown} val Value to format.
 * @returns {string}
 */
export function format(val) {
    if (val instanceof Date)
        return DateTime.fromJSDate(val).toLocaleString(DateTime.DATE_SHORT);
    if (typeof val === 'string' && isIsoDate(val))
        return DateTime.fromISO(val).toLocaleString(DateTime.DATE_SHORT);
    return val.toString();
}
