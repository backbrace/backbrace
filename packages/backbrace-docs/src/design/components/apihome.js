import { Section } from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class ApiHome extends Section {

    render() {
        return this.html`
            <h1 style="margin: 30px;">API List</h1>
            ${this.state.data.slice().sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name)).map((m) =>
            this.html`<div class="col-sm-12 col-md-6 col-lg-4" style="line-height: 3em; font-size: 1em; display:inline-block; margin: 0;">
                <a bb-route="api/${m.name}">
                <label class="api-type ${m.kind}" style="margin-right: 10px;">${m.kind.substr(0, 1)}</label>
                 ${m.name} ${m.access ? '(' + m.access + ')' : ''}
                </a>
                </div>`)}
        `;
    }

}

Section.define('docs-apihome', ApiHome);
