import { Component } from './component';
import { processLinks } from '../route';

/**
 * @class RouteErrorComponent
 * @extends {Component}
 * @description
 * Route error.
 */
export class RouteErrorComponent extends Component {

    /**
     * @constructs RouteErrorComponent
     * @param {RouteError} err Error object.
     */
    constructor(err) {
        super();

        this.err = err;
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {RouteErrorComponent} Returns itself for chaining.
     */
    load(cont) {
        super.load(cont);
        this.container.html(`<div class="route-error">
        <h1>Oops, we had an issue</h1><span>${this.err.message}</span></div>`);
        processLinks();
        return this;
    }
}
