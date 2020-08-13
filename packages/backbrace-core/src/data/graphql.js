import { DataHandler } from '../providers/data';
import { get as getWindow } from '../providers/window';
import { appState } from '../state';

/**
 * @class GraphqlHandler
 * @augments DataHandler
 * @description
 * JSON file handler.
 */
export default class GraphqlHandler extends DataHandler {

    /**
     * Execute a graphql query.
     * @async
     * @param {string} query Graphql query to execute.
     * @param {Object} variables Graphql variables.
     * @returns {Promise<import('../types').dataInfo>}
     */
    async fetch(query, variables) {

        const window = getWindow();

        let body = {};
        if (query)
            body.query = query;

        body.variables = variables;

        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (appState.auth?.token)
            headers.Authorization = 'Bearer ' + appState.auth.token;

        let res = await window.fetch(this.config.url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        /**
         * @ignore
         * @type {import('../types').dataInfo}
         */
        let ret = {
            count: 0,
            error: '',
            data: null
        };

        if (res.ok) {
            let json = await res.json();
            if (json?.errors?.[0].message) {
                ret.error = json.errors[0].message;
            } else {
                ret.data = json;
                ret.count = json.count;
            }
        } else {
            ret.error = res.statusText;
        }

        return ret;
    }

    /**
     * Find a data set.
     * @async
     * @param {import('../types').dataOptions} options Data options.
     * @param {Object} [params] Page parameters.
     * @param {import('../types').pageDesign} [page] Page design.
     * @param {import('../types').pageSectionDesign} [section] Page section design.
     * @returns {Promise<import('../types').dataInfo>}
     */
    async find(options, params, page, section) {

        let queryParams = [];
        for (let a in params) {
            queryParams.push(`$${a}: String!`);
        }

        let fields = options.fields || [];
        options.bind = options.bind || `data.${options.source}.returning`;
        if (section) {
            for (let f of section.fields)
                if (!fields.includes(f.bind))
                    fields.push(f.bind);
        }

        let query = `
            query find_${options.source}${queryParams.length > 0 ? `(${queryParams.join(',')})` : ''}{
                ${options.source}(${options.args}) {
                    count
                    returning {
                        ${fields.join(' ')}
                    }
                }
            }
        `;

        return this.fetch(query, params);
    }

    /**
     * Update data.
     * @async
     * @param {import('../types').dataOptions} options Data options.
     * @param {Object} [params] Page parameters.
     * @param {import('../types').pageDesign} [page] Page design.
     * @param {import('../types').pageSectionDesign} [section] Page section design.
     * @param {Object[]} [data] Data to update.
     * @returns {Promise<import('../types').dataInfo>}
     */
    async update(options, params, page, section, data) {

        let queryParams = [];
        for (let a in params) {
            queryParams.push(`$${a}: String!`);
        }

        let fields = options.fields || [];
        let values = {};
        let updateParams = [];
        if (section) {
            for (let f of section.fields) {
                if (!fields.includes(f.bind))
                    fields.push(f.bind);
                queryParams.push(`$${f.bind}: String!`);
                updateParams.push(`${f.bind}: $${f.bind}`);
                values[f.bind] = data[0][f.bind];
            }
        }

        if (this.config.user?.source && options.source === this.config.user.source)
            appState.user = {
                ...appState.user,
                ...values
            };

        let mutation = `
            mutation update_${options.source}(${queryParams.join(',')}){
                update_${options.source}(${options.args},update:{${updateParams.join(',')}}) {
                    returning {
                        ${fields.join(' ')}
                    }
                }
            }
        `;

        return this.fetch(mutation, {
            ...params,
            ...values
        });
    }

}
