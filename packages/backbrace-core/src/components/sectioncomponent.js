import { Component } from './component';
import { ActionsComponent } from './actions';
import { WindowComponent } from './window';
import { promiseblock } from '../promises';
import { load as loadModule } from '../module';

/**
 * @class
 * @extends {Component}
 * @description
 * Section component base class.
 */
export class SectionComponent extends Component {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Parent viewer.
     * @param {pageSectionDesign} design Section design.
     */
    constructor(viewer, design) {

        super();

        /**
         * @description
         * Parent viewer.
         * @type {ViewerComponent}
         */
        this.viewer = viewer;

        /**
         * @description
         * Section window.
         * @type {WindowComponent}
         */
        this.window = null;

        /**
         * @description
         * Section design.
         * @type {pageSectionDesign}
         */
        this.design = design;

        /**
         * @description
         * Data source of the section.
         * @type {any[]}
         */
        this.data = null;

        /**
         * @description
         * On before update of the section.
         * @type {dataCallback}
         */
        this.onBeforeUpdate = null;
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {SectionComponent|JQueryPromise} Returns itself for chaining.
     */
    load(cont) {

        // Create the window.
        this.window = new WindowComponent({
            className: this.design.className,
            icon: this.design.icon
        });
        this.window.load(cont);

        // Set the window title.
        this.setTitle(this.design.text);

        // Add actions.
        let actions = new ActionsComponent();
        actions.load(this.window.toolbar);
        this.design.actions.forEach((action) => actions.addAction(action, (action) => {
            this.viewer.actionRunner(action);
        }));

        return this.attachController();
    }

    /**
     * Attach the section controller
     * @returns {JQueryPromise} Promises to attach the controller.
     */
    attachController() {
        if (this.design.controller)
            return promiseblock(
                () => loadModule(this.design.controller),
                (mod) => mod(this.viewer, this)
            );
    }

    /**
     * @description
     * Set the title of the page.
     * @param {string} title Title to change to.
     * @returns {SectionComponent} Returns itself for chaining.
     */
    setTitle(title) {
        if (this.window)
            this.window.setTitle(title);
        return this;
    }

    /**
     * Show the loader.
     * @returns {SectionComponent} Returns itself for chaining.
     */
    showLoad() {
        if (this.window)
            this.window.loader.show();
        return this;
    }

    /**
     * Hide the loader.
     * @returns {SectionComponent} Returns itself for chaining.
     */
    hideLoad() {
        if (this.window)
            this.window.loader.hide();
        return this;
    }

    /**
     * Hide the preloader.
     * @returns {SectionComponent} Returns itself for chaining.
     */
    hidePreLoad() {
        if (this.window)
            this.window.preloader.hide();
        return this;
    }

}
