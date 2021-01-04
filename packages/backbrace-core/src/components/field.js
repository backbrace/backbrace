import { Component } from './component';

/**
 * @class Field
 * @augments Component
 * @description
 * Field component base class.
 */
export class Field extends Component {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['cols', 'string'],
            ['helpertext', 'string'],
            ['caption', 'string']
        ]);
    }

    /**
     * @constructs Field
     */
    constructor() {

        super();

        /**
         * @description
         * Field design.
         * @type {import('../types').pageFieldDesign}
         */
        this.design = null;

        /**
         * @description
         * Column layout. Defaults to `col-sm-12 col-md-6`.
         * @type {string}
         */
        this.cols = 'col-sm-12 col-md-6';

        /**
         * @description
         * Field value.
         * @type {string}
         */
        this.value = '';

        /**
         * @description
         * Helper text.
         * @type {string}
         */
        this.helpertext = '';

        /**
         * @description
         * Field caption.
         * @type {string}
         */
        this.caption = '';

    }

    /**
     * Set the component attributes from the field design.
     * @returns {void}
     */
    setAttributes() {
        if (this.design)
            Object.entries(this.design.attributes).forEach(([name, value]) => this.setAttribute(name, value));
    }

    /** @override */
    render() {

        // Add classes.
        if (this.cols)
            this.cols.split(' ').forEach((c) => this.classList.add(c));

        if (this.state.hasError)
            return;

        if (this.state.data.length > 0 && this.design.bind) {
            let bindData = this.state.data[0];
            this.design.bind.split('.').forEach((bprop) => {
                if (typeof bindData[bprop] === 'undefined') {
                    throw this.error('bind', `Data binding failed for ${this.design.bind} on property ${bprop}`);
                }
                bindData = bindData[bprop];
            });
            const val = bindData;
            this.value = val;
        }
    }
}
