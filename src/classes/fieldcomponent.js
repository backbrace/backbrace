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
    }

}
