import { SectionComponent } from '../sectioncomponent';

/**
 * @class CardPageComponent
 * @extends {SectionComponent}
 * @description
 * Card component class.
 */
export class CardPageComponent extends SectionComponent {

    /**
     * @constructs CardPageComponent
     * @param {ViewerComponent} viewer Viewer component.
     * @param {pageSectionDesign} design Section design.
     */
    constructor(viewer, design) {

        super(viewer, design);

        /**
         * @description
         * Field components.
         * @type {Map<string, Component>}
         */
        this.fields = new Map();
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        Array.from(this.fields.values()).forEach((cont) => cont.unload());
        this.fields = null;

        super.unload();
    }

    /**
     * @async
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {Promise} Promise to load the card.
     */
    async load(cont) {

        // Load the section component.
        await super.load(cont);

        // Load the fields.
        await this.loadFields(this.window, this.design.fields);
    }

    /**
     * @async
     * @description
     * Load the fields for a section.
     * @param {WindowComponent} win Window to load the fields into.
     * @param {pageFieldDesign[]} fields Fields to load.
     * @returns {Promise} Promise to return after we load the fields.
     */
    async loadFields(win, fields) {

        for (let field of fields) {

            let comp = field.component || 'textfield';

            if (comp.indexOf('.js') === -1) {

                const { default: Control } = await import(
                    /* webpackChunkName: "[request]" */
                    `../fieldcomponents/${comp}.js`);

                /** @type {FieldComponent} */
                let cont = new Control(this, field);
                this.fields.set(field.name, cont);

                await cont.load(win.main);
            }
        }
    }

    /**
     * @async
     * @description
     * Update the card page with a data source.
     * @returns {Promise} Returns a promise to update the card page.
     */
    async update() {

        // Only show the data for the first record.
        let r = null;
        if (this.data && this.data.length > 0)
            r = this.data[0];

        // Update the fields.
        for (let cont of this.fields.values()) {
            cont.data = r;
            await cont.update();
        }
    }
}

export default CardPageComponent;
