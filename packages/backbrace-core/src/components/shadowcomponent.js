import { Component } from './component';

/**
 * @class ShadowComponent
 * @augments Component
 * @description
 * Shadow component class. Attaches the component to the shadow DOM.
 */
export class ShadowComponent extends Component {

    /**
     * @constructs ShadowComponent
     */
    constructor() {

        super();

        /**
         * @description
         * Shadow root.
         * @type {ShadowRoot}
         */
        this.root = this.attachShadow({ mode: 'open' });
    }

    /**
     * @override
     */
    container() {
        return this.root;
    }

}
