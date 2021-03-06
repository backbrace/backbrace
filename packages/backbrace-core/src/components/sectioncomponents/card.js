import { Container } from '../container';
import { settings } from '../../settings';

/**
 * @class Card
 * @augments Container
 * @description
 * Card section.
 */
export class Card extends Container {

    /**
     * @constructs Card
     */
    constructor() {

        super();

        /**
         * @description
         * Field components.
         * @type {Map<string, import('../field').Field>}
         */
        this.fields = new Map();
    }

    /** @override */
    async load() {

        await super.load();

        // Load the fields.
        for (let fieldDesign of this.design.fields) {

            let field = await this.getFieldComponent(fieldDesign.component, fieldDesign.type);

            // Setup the component.
            field.design = fieldDesign;
            field.caption = fieldDesign.caption;
            if (this.state.data.length > 0)
                field.state.data = [this.state.data[0]];

            await field.bind();

            // Set the component attributes.
            field.setAttributes();

            this.fields.set(fieldDesign.name, field);

        }

        this.update();
    }

    /**
     * Get a field component by name.
     * @param {string} name Name or path of the component.
     * @param {string} type Field type.
     * @returns {Promise<import('../field').Field>} Returns the section component.
     */
    async getFieldComponent(name, type) {

        let Component = null;

        if (name === '') {
            if (type === 'Text')
                name = 'textbox';
        }

        if (!name)
            return null;

        if (!name.endsWith('.js')) {
            // Import built-in control.
            const { default: Control } = await import(
                /* webpackChunkName: "[request]" */
                `../fieldcomponents/${name}.js`);
            Component = Control;
        } else {
            // Import external component.
            const { default: Control } = await import(
                /* webpackIgnore: true */
                `${settings.dir.design}${name}`);
            Component = Control;
        }

        return new Component();
    }

    /** @override */
    renderContent() {

        // Set the loading state.
        for (let f of this.fields.values()) f.state.isLoading = this.state.isLoading;

        return this.html`
            <div class="row no-margin"></div>
            <div class="row">
                ${Array.from(this.fields.values())}
            </div>
        `;
    }

}

export default Card;

Container.define('bb-card', Card);
