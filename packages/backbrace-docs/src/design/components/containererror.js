import {
    Container
} from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class ContainerError extends Container {

    static attributes() {
        return new Map([
            ['showstack', 'boolean']
        ]);
    }
    constructor() {
        super();
        this.showstack = false;
    }

    renderContent() {
        return this.html`
            <bb-error .err=${new Error('Test error')} .showstack=${this.showstack}></bb-error>
        `;
    }

}

Container.define('docs-container-error', ContainerError);
