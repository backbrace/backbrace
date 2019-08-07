import $ from 'jquery';
import { get as getIcons } from '../providers/icons';
import { Component } from './component';

/**
 * @class
 * @extends {Component}
 * @description
 * Window component.
 */
export class WindowComponent extends Component {

    /**
     * @constructor
     * @param {windowOptions} [options] Window options.
     */
    constructor({
        icon,
        className = ''
    } = {}) {

        super();

        /**
         * @description
         * Options for the window component.
         * @type {windowOptions}
         */
        this.options = {
            className,
            icon
        };

        /**
         * @description
         * Main container.
         * @type {JQuery}
         */
        this.main = null;

        /**
         * @description
         * Toolbar container.
         * @type {JQuery}
         */
        this.toolbar = null;

        /**
         * @description
         * Titlebar container.
         * @type {JQuery}
         */
        this.titlebar = null;

        /**
         * @description
         * Loader overlay.
         * @type {JQuery}
         */
        this.loader = null;

    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {WindowComponent} Returns itself for chaining.
     */
    load(container) {

        this.loader = $('<div class="overlay"></div>').hide();

        this.titlebar = $('<div class="title-bar unselectable" />');

        this.titlebar.append('<h6 id="title' + this.id + '" class="title unselectable cuttext" />');

        this.main = $('<div class="row" />');
        this.toolbar = $('<div class="row no-margin" />');

        if (!this.options.className || this.options.className === '')
            this.options.className = 'col-sm-12';

        this.container = $('<div class="' + this.options.className + '" />')
            .appendTo(container);

        $('<div id="window' + this.id + '" class="window" />')
            .append(this.loader)
            .append(this.titlebar)
            .append(this.toolbar)
            .append(this.main)
            .appendTo(this.container);

        return this;
    }

    /**
     * @description
     * Set the window's title.
     * @param {string} title Title to set.
     * @returns {WindowComponent} Returns itself for chaining.
     */
    setTitle(title) {
        const icons = getIcons();
        $('#title' + this.id).html(
            (this.options.icon ? icons.get(this.options.icon) + ' ' : '')
            + title);
        return this;
    }

    /**
     * Add a title bar icon.
     * @param {string} icon Icon name.
     * @param {genericFunction} onclick On click function.
     * @returns {void}
     */
    addTitlebarIcon(icon, onclick) {
        const icons = getIcons();
        $(icons.get('%refresh%'))
            .addClass('unselectable title-icon')
            .appendTo(this.titlebar)
            .click(onclick);
    }

}
