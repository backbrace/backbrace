import $ from 'jquery';
import { uid } from '../util';

/**
 * @class Component
 * @description
 * Component class.
 *
 * Used as the base for all components.
 */
export class Component {

    /**
     * @constructs Component
     */
    constructor() {

        /**
         * @description
         * ID of the component.
         * @type {number}
         */
        this.id = uid();

        /**
         * @description
         * Container for the component.
         * @type {JQuery}
         */
        this.container = null;

        /**
         * @readonly
         * @description
         * If `true` the component is currently visible.
         * @type {boolean}
         */
        this.visible = false;

        /**
         * @description
         * Set to `true` to keep the component hidden.
         * @type {boolean}
         */
        this.hidden = false;

        /**
         * @description
         * Template for the component.
         * @type {string}
         */
        this.template = '';

        /**
         * @description
         * Component data source.
         * @type {any[]}
         */
        this.data = [];
    }

    /**
     * @description
     * Load the component into a  `container`.
     * @param {JQuery} container Container to load into.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    load(container) {
        this.container = $('<div class="component" />').appendTo(container);
        return this;
    }

    /**
     * @description
     * Invokes before updating the component.
     * @returns {boolean} Return false to skip updating of the component.
     */
    shouldUpdate() {
        return true;
    }

    /**
     * @description
     * Invokes before updating the component.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    beforeUpdate() {
        return this;
    }

    /**
     * @description
     * Update the component with the data source.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    update() {
        return this;
    }

    /**
     * @description
     * Invokes after updating the component.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    afterUpdate() {
        return this;
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {
        if (this.container)
            this.container.remove();
        this.container = null;
    }

    /**
     * @description
     * Show the component if it is not marked as `hidden`.
     * @returns {Component} Returns itself for chaining.
     */
    show() {
        if (this.container && !this.hidden)
            this.container.show();
        this.visible = false;
        return this;
    }

    /**
     * @description
     * Hide the component.
     * @returns {Component} Returns itself for chaining.
     */
    hide() {
        if (this.container && !this.hidden)
            this.container.hide();
        this.visible = !this.hidden;
        return this;
    }

}
