import { Component } from './component';

/**
 * @class
 * @extends {Component}
 * @description
 * Field component base class.
 */
export class FieldComponent extends Component {

    /**
     * @constructor
     * @param {PageComponent} parent Parent page component.
     * @param {PageFieldMeta} field Field meta data.
     */
    constructor(parent, field) {

        super();

        /**
         * @description
         * Parent component.
         * @type {PageComponent}
         */
        this.parent = parent;

        /**
         * @description
         * Field meta data.
         * @type {PageFieldMeta}
         */
        this.field = field;

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
     * @param {Object} data Data source.
     * @returns {FieldComponent|JQueryPromise} Returns itself for chaining.
     */
    update(data) {
        let fieldData = data ? data[this.field.name] : null;
        if (this.control)
            this.control.val(fieldData);
        return this;
    }

}
