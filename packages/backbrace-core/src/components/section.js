import { Component } from './component';

/**
 * @class Section
 * @augments Component
 * @description
 * Section component base class.
 */
export class Section extends Component {

    /**
     * @constructs Section
     */
    constructor() {

        super();

        /**
         * @description
         * Section design.
         * @type {import('../types').pageSectionDesign}
         */
        this.design = null;

        /**
         * @description
         * Page params.
         * @type {Object}
         */
        this.params = {};
    }

    /**
     * Set the component attributes from the section design.
     * @returns {void}
     */
    setAttributes() {
        if (this.design)
            Object.entries(this.design.attributes).forEach(([name, value]) => this.setAttribute(name, value));
    }

    /**
     * Load the component.
     * @async
     * @returns {Promise<void>}
     */
    async load() {
    }

    /**
     * Runs after all sections have been added to the page.
     * @returns {void}
     */
    show() {
    }

}
