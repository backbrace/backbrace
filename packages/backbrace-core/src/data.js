import { settings } from './settings';

import { get as getWindow } from './providers/window';

/**
 * @module data
 * @private
 * @description
 * Data management.
 */

/**
 * @ignore
 * @description
 * Bearer token.
 * @type {string}
 */
let bearer = null;

/**
 * Set the bearer token.
 * @param {string} token Bearer token.
 * @returns {void}
 */
export function setBearer(token) {
    bearer = token;
}

/**
 * @async
 * @description
 * Get data from a data source.
 * @param {string} url Data url.
 * @param {string} url Data query.
 * @returns {Promise<any>}
 */
export async function fetch(url, query) {

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

        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (bearer)
            headers.Authorization = 'Bearer ' + bearer;

        let res = await window.fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        if (res.ok) {
            return await res.json();
        }
    }

    return null;
}
