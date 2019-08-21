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
    }

    /**
     * @description
     * Load the component and append to `container`.
     * @param {JQuery} container Container to load into.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    load(container) {
        this.container = $('<div class="component" />').appendTo(container);
        return this;
    }

    /**
     * @description
     * Update the component with a data source.
     * @param {any[]} data Data to bind to the component.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    update(data) {
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
     * Show the component if `hide` is `false`.
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
