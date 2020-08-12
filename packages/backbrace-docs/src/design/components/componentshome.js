import { Section } from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class ComponentsHome extends Section {

    render() {
        return this.html`
            ${['Field', 'Section'].map((type) =>
            this.html`<div style="margin-top: 20px">
                <h4>${type} Components</h4>
                ${this.state.data.filter(c => c.type === type.toLowerCase()).map((c) =>
                this.html`<div class="col-sm-12 col-md-6 col-lg-4"
                    style="line-height: 3em; font-size: 1em; display:inline-block; margin: 0;">
                    <a bb-route="components/${c.name}">
                    <label class="comp-type ${c.type}" style="margin-right: 10px;">${c.initals}</label>
                    ${c.caption}
                    </a>
                    </div>`)}
            </div>`)}
        `;
    }

}

Section.define('docs-components', ComponentsHome);
