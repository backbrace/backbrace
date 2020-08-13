/**
 * @class DataHandler
 * @description
 * Data handler class. Used with the data provider.
 */
export class DataHandler {

    /**
     * @constructs DataHandler
     */
    constructor() {
        /**
         * @description
         * Data handler config.
         * @type {import('../types').dataConfig}
         */
        this.config = null;
    }

    /**
     * Execute a query.
     * @async
     * @param {string} query Query to execute.
     * @param {Object} [variables] Variables.
     * @returns {Promise<import('../types').dataInfo>}
     */
    async fetch(query, variables) {
        return null;
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
        return {
            count: 0,
            data: [],
            error: 'Invalid data handler'
        };
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
        return {
            count: 0,
            data: [],
            error: 'Invalid data handler'
        };
    }

}

/**
 * Data handler provider.
 * @module dataprovider
 * @private
 */

let instance = new DataHandler();

/**
 * Get the current data handler.
 * @returns {DataHandler} Returns the data handler.
 */
export function get() {
    return instance;
}

/**
 * Set the current data handler.
 * @param {DataHandler} ref Data handler to set.
 * @returns {void}
 */
export function set(ref) {
    instance = ref;
}
