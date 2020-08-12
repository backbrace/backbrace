import {
    dom as $,
    Section
} from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class ComponentTitle extends Section {

    constructor() {
        super();
        this.description = '';
        this.api = '';
    }

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['description', 'string'],
            ['api', 'string']
        ]);
    }

    render() {
        return this.html`
            <a bb-route="components">Components</a> > <a bb-route="components/${this.design.name}">${this.design.caption}</a>
            <h4>${this.design.caption}</h4>
            <div class="alert is-important">
                <a bb-route="api/${this.api}">Checkout the API for ${this.api}</a>
            </div>
            ${$(this.description)}
        `;
    }

}

Section.define('docs-component-title', ComponentTitle);
