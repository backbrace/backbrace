import { settings } from '../settings';
import { get as getJQuery } from '../providers/jquery';
import { get as getIcons } from '../providers/icons';
import { Component } from '../classes/component';

/**
 * @class
 * @extends {Component}
 * @description
 * Header component.
 */
export class HeaderComponent extends Component {

    /**
     * @constructor
     * @param {HeaderOptions} options Header options.
     */
    constructor(options) {

        super();

        /**
         * @description
         * Options for the header component.
         * @type {HeaderOptions}
         */
        this.options = {
            menuIcon: 'menu',
            attachMenu: true,
            class: ''
        };

        // Merge options.
        getJQuery().extend(this.options, options);

        /**
         * @description
         * Nav bar container.
         * @type {JQuery}
         */
        this.navbar = null;

        /**
         * @description
         * Main menu container.
         * @type {JQuery}
         */
        this.menu = null;

        /**
         * @description
         * Menu icon.
         * @type {JQuery}
         */
        this.menuIcon = null;

        /**
         * @description
         * Title bar container.
         * @type {JQuery}
         */
        this.titleBar = null;

        /**
         * @description
         * Profile image.
         * @type {JQuery}
         */
        this.profileImage = null;

        /**
         * @description
         * If `true` the main menu is visible.
         * @type {boolean}
         */
        this.menuExtended = false;

        /**
         * @description
         * Current title.
         * @type {string}
         */
        this.title = '';
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {
        // Unload the DOM.
        this.menuIcon.remove();
        this.menuIcon = null;
        super.unload();
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    load(container) {

        const $ = getJQuery(),
            icons = getIcons();

        this.container = $(`<header class="header ${this.options.class}"></header>`).appendTo(container);

        this.navbar = $('<nav class="navbar fixed"><div class="navbar-inner z-depth-1">'
            + '</div></nav>').appendTo(this.container);

        // Setup the menu icon.
        this.menuIcon = $('<div class="menu-icon" data-ripple></div>')
            .appendTo(this.navbar.children())
            .html(icons.get(this.options.menuIcon, '35px'))
            .ripple();

        // Setup title bar.
        this.titleBar = $('<div class="navbar-brand unselectable cuttext">'
            + this.title + '</div>').appendTo(this.navbar.children());

        if (this.options.attachMenu) {

            // Add a menu.
            this.menu = $('<div class="menu z-depth-1">'
                + '<div class="menu-brand">'
                + (settings.style.images.menuLogo !== '' ?
                    '<img class="menu-logo show-on-large" src="' + settings.style.images.menuLogo + '" />' :
                    '')
                + '</div>'
                + '<ul id="mnuMain" /></div>').appendTo(this.container);

            // Add profile image.
            this.profileImage = $('<img class="circle-img profile-img" />')
                .appendTo($('.navbar-inner'));

            $(window.document).on('click', (event) => {
                if (!$(event.target).closest('.menu-icon').length) {
                    this.hideMenu();
                    event.preventDefault();
                    return false;
                }
            });
        }
        return this;
    }

    /**
     * @description
     * Load the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    loadMenu() {
        return this;
    }

    /**
     * @description
     * Load the profile image.
     * @param {string} url Profile image url.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    loadProfileImage(url) {
        this.profileImage.show().attr('src', url);
        return this;
    }

    /**
     * @description
     * Show the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    showMenu() {
        this.menu.show().animate({
            left: '0px'
        }, null, () => {
            this.menuExtended = true;
        });
        return this;
    }

    /**
     * @description
     * Hide the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    hideMenu() {
        this.menu.animate({
            left: '-300px'
        }, null, () => {
            this.menu.hide();
            this.menuExtended = false;
        });
        return this;
    }

    /**
     * @description
     * Set the title.
     * @param {string} title New title.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    setTitle(title) {
        this.title = title;
        if (this.titleBar)
            this.titleBar.html(title);
        return this;
    }
}
