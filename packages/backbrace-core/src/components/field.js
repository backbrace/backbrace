import { Component } from './component';
import { observable, makeObservable } from 'mobx';

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
        this._value = '';

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

        makeObservable(this, {
            caption: observable,
            helpertext: observable
        });

    }

    /**
     * Set the component attributes from the field design.
     * @returns {void}
     */
    setAttributes() {
        if (this.design)
            Object.entries(this.design.attributes).forEach(([name, value]) => this.setAttribute(name, value));
    }

    /**
     * Bind the field to the data.
     * @async
     * @returns {Promise<void>}
     */
    async bind() {

        if (this.state.hasError)
            return;

        if (this.state.data.length > 0 && this.design.bind) {
            let bindData = this.state.data[0];
            this._value = bindData[this.design.bind];
        }

    }

    /**
     * Getter on `this.value`.
     * @ignore
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * Setter on `this.value`
     * @ignore
     * @returns {void}
     */
    set value(newValue) {
        if (this.state.data.length > 0 && this.design.bind) {
            let bindData = this.state.data[0];
            bindData[this.design.bind] = newValue;
        }
        this._value = newValue;
        this.update();
    }

    /** @override */
    render() {

        // Add classes.
        if (this.cols)
            this.cols.split(' ').forEach((c) => this.classList.add(c));

    }
}
