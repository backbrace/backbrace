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
     * @param {WindowOptions} options Window options.
     */
    constructor(options) {

        super();

        /**
         * @description
         * Options for the window component.
         * @type {WindowOptions}
         */
        this.options = {
            className: '',
            hasParent: false,
            closeBtn: true,
            icon: null,
            onClose: null
        };

        // Merge options.
        getJquery().extend(this.options, options);

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

        let titlebar = $('<div class="title-bar unselectable" />');

        titlebar.append('<h5 id="title' + this.id + '" class="title ' +
            (this.options.hasParent ? 'alt' : 'hide-on-med-and-down') + ' unselectable cuttext" />');

        if (this.options.closeBtn === true && !this.options.hasParent && !isMobileDevice()) {
            $(icons.get('close'))
                .addClass('unselectable title-icon')
                .appendTo(titlebar)
                .click(() => this.options.onClose());
        }

        this.main = $('<div class="row" />');
        this.toolbar = $('<div class="row no-margin" />');

        this.container = $('<div id="window' + this.id + '" class="window container' + (!isMobileDevice() ? ' z-depth-1' : '') + '" />')
            .addClass(this.options.className)
            .append(titlebar)
            .append(this.toolbar)
            .append(this.main)
            .appendTo(container);

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
            (this.options.icon ? icons.get(this.options.icon, null, '#666') + ' ' : '')
            + title);
        return this;
    }

}
