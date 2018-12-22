import { get as getJquery } from '../providers/jquery';
import { get as getIcons } from '../providers/icons';
import { Component } from '../classes/component';
import { isMobileDevice } from '../util';

/**
 * @class
 * @extends {Component}
 * @description
 * Window component.
 */
export class WindowComponent extends Component {

    /**
     * @constructor
     * @param {WindowOptions} [options] Window options.
     */
    constructor({
        hasParent = false,
        closeBtn = true,
        icon,
        onClose,
        className = ''
    } = {}) {

        super();

        /**
         * @description
         * Options for the window component.
         * @type {WindowOptions}
         */
        this.options = {
            className,
            hasParent,
            closeBtn,
            icon,
            onClose
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

        /**
         * @description
         * Pre-loader overlay.
         * @type {JQuery}
         */
        this.preloader = null;
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {WindowComponent} Returns itself for chaining.
     */
    load(container) {

        const $ = getJquery(),
            icons = getIcons();

        this.preloader = $('<div class="preloader' + (!isMobileDevice() ? ' z-depth-1' : '') + '"></div>');
        this.loader = $('<div class="overlay"><div class="progress"><div class="indeterminate"></div></div></div>').hide();

        this.titlebar = $('<div class="title-bar unselectable" />');

        this.titlebar.append('<h5 id="title' + this.id + '" class="title ' +
            (this.options.hasParent ? 'alt' : '') + ' unselectable cuttext" />');

        if (this.options.closeBtn === true && !this.options.hasParent && !isMobileDevice()) {
            $(icons.get('%close%'))
                .addClass('unselectable title-icon')
                .appendTo(this.titlebar)
                .click(() => this.options.onClose());
        }

        this.main = $('<div class="row" />');
        this.toolbar = $('<div class="row no-margin" />');

        if (!this.options.className || this.options.className === '')
            this.options.className = 's12';

        this.container = $('<div class="col ' + this.options.className + '" />')
            .appendTo(container);

        $('<div id="window' + this.id + '" class="window ' + (!isMobileDevice() ? ' z-depth-1' : '') + '" />')
            .append(this.preloader)
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
        const $ = getJquery(),
            icons = getIcons();
        $('#title' + this.id).html(
            (this.options.icon ? icons.get(this.options.icon) + ' ' : '')
            + title);
        return this;
    }

    /**
     * Add a title bar icon.
     * @param {string} icon Icon name.
     * @param {GenericFunction} onclick On click function.
     * @returns {void}
     */
    addTitlebarIcon(icon, onclick) {
        const $ = getJquery(),
            icons = getIcons();
        $(icons.get('%refresh%'))
            .addClass('unselectable title-icon')
            .appendTo(this.titlebar)
            .click(onclick);
    }

}
