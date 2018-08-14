import { Component } from './component';

/**
 * @class
 * @extends {Component}
 * @description
 * Page component base class.
 */
export class PageComponent extends Component {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     */
    constructor(viewer) {

        super();

        /**
         * @description
         * Viewer component.
         * @type {ViewerComponent}
         */
        this.viewer = viewer;
    }

    /**
     * Show the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    showLoad() {
        this.viewer.window.loader.show();
        return this;
    }

    /**
     * Hide the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hideLoad() {
        this.viewer.window.loader.hide();
        return this;
    }

    /**
     * Hide the preloader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hidePreLoad() {
        this.viewer.window.preloader.hide();
        return this;
    }

}
