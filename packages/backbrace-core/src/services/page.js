/**
 * @class PageService
 * @description
 * Page Service class.
 */
export class PageService {

    /**
     * @constructs PageService
     * Page Service Constructor.
     * @param {import('../components/page').Page} page Page component.
     */
    constructor(page) {

        /**
         * @description
         * Page component.
         * @type {import('../components/page').Page}
         */
        this.page = page;
    }

    /**
     * Load the page service.
     * @async
     * @returns {Promise<void>}
     */
    async load() {
    }

    /**
     * Called after the page is loaded.
     * @async
     * @returns {Promise<void>}
     */
    async pageLoad() {

    }

}
