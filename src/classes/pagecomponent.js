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

}
