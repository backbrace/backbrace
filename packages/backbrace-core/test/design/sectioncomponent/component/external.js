import { Section } from '../../../../dist/Backbrace.js';

export default class External extends Section {

    render() {
        return this.html`<b>foo</b>`;
    }

}

Section.define('test-external', External);
