import { promiseblock, promiseeach } from '../../promises';
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
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(cont) {

        // Load the section component.
        super.load(cont);

        // Load the fields.
        return this.loadFields(this.window, this.design.fields);
    }

    /**
     * @description
     * Load the fields for a section.
     * @param {WindowComponent} win Window to load the fields into.
     * @param {pageFieldDesign[]} fields Fields to load.
     * @returns {JQueryPromise} Promise to return after we load the fields.
     */
    loadFields(win, fields) {

        return promiseeach(fields, (field, i) => {

            let comp = field.component;

            if (comp === '') {
                comp = 'textfield';
            }
            if (comp.indexOf('.js') === -1) {

                return promiseblock(

                    () => {
                        return import(
                            /* webpackChunkName: "[request]" */
                            `../fieldcomponents/${comp}.js`);
                    },
                    ({ default: Control }) => {

                        let cont = new Control(this, field);
                        this.fields.set(field.name, cont);

                        return cont.load(win.main);
                    }

                );
            }
        });
    }

    /**
     * @description
     * Update the card page with a data source.
     * @returns {JQueryPromise} Returns a promise to update the card page.
     */
    update() {

        // Only show the data for the first record.
        let r = null;
        if (this.data && this.data.length > 0)
            r = this.data[0];

        // Update the fields.
        return promiseeach(Array.from(this.fields.values()), function(cont) {
            cont.data = r;
            return cont.update();
        });
    }
}

export default CardPageComponent;
