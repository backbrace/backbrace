import { isMobileDevice } from '../util';
import { get as getJQuery } from '../providers/jquery';
import { ActionComponent } from './action';
import { Component } from '../classes/component';

/**
 * @class
 * @extends {Component}
 * @description
 * Actions bar component.
 */
export class ActionsComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super();
        /**
         * @description
         * Action components.
         * @type {Map<string, ActionComponent>}
         */
        this.actions = new Map();
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        const $ = getJQuery();

        // Unload each button.
        $.each(this.actions, function(index, btn) {
            btn.unload();
        });

        super.unload();
    }

    /**
     * @description
     * Load the component into the container.
     * @param {JQuery} container JQuery element to load the component into.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    load(container) {
        super.load(container);
        this.container.addClass('actions-bar unselectable no-padding col s12' + (isMobileDevice() ? ' z-depth-1' : ''));
        return this;
    }

    /**
     * @description
     * Add an action button.
     * @param {PageActionMeta} action Action meta data.
     * @param {ActionRunner} runfunc Action runner function.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    addAction(action, runfunc) {
        let btn = new ActionComponent(action, runfunc);
        btn.load(this.container);
        this.actions.set(action.name, btn);
        return this;
    }

    /**
     * @description
     * Get an action by name.
     * @param {string} name Name of the action to get.
     * @returns {ActionComponent} Returns the action.
     */
    action(name) {
        return this.actions.get(name);
    }

    /**
     * @description
     * Show the component.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    show() {
        if (isMobileDevice()) {
            this.container.show().animate({
                bottom: 60 - this.container.height()
            });
        } else {
            this.container.show();
        }
        return this;
    }
}
