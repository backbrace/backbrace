import { Component } from './component';

/**
 * @class FieldComponent
 * @extends {Component}
 * @description
 * Field component base class.
 */
export class FieldComponent extends Component {

    /**
     * @constructs FieldComponent
     * @param {SectionComponent} parent Parent page component.
     * @param {pageFieldDesign} field Field design.
     */
    constructor(parent, field) {

        super();

        /**
         * @description
         * Parent component.
         * @type {SectionComponent}
         */
        this.parent = parent;

        /**
         * @description
         * Field design.
         * @type {pageFieldDesign}
         */
        this.design = field;

        /**
         * @description
         * Control part of the component.
         * @type {JQuery}
         */
        this.control = null;

        /**
         * @description
         * Label part of the component.
         * @type {JQuery}
         */
        this.label = null;
    }

    /**
     * @description
     * Update the field from the data source.
     * @returns {FieldComponent|JQueryPromise} Returns itself for chaining.
     */
    update() {
        let fieldData = this.data ? this.data[this.design.dataName || this.design.name] : null;
        if (this.control)
            this.control.val(fieldData);
        return this;
    }

}
