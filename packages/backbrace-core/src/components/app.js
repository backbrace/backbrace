import $ from 'jquery';
import 'npm/reset-css/reset.css';
import '../styles/base.scss';

import './fieldcomponent';
import './sectioncomponent';
import './actions';
import './window';

import { error } from '../error';
import { promisequeue } from '../promises';
import { settings } from '../settings';
import * as sweetalert from '../sweetalert';
import { isMobileDevice } from '../util';
import { set as setAlert } from '../providers/alert';
import { get as getIcons } from '../providers/icons';
import { Component } from './component';
import { HeaderComponent } from './header';
import { ViewerComponent } from './viewer';
import { processLinks } from '../route';

const appError = error('appcomponent');

/**
 * @class AppComponent
 * @extends {Component}
 * @description
 * App component.
 */
export class AppComponent extends Component {

    /**
     * @constructs AppComponent
     */
    constructor() {

        super();

        /**
         * @ignore
         * @type {JQuery}
         */
        this.maincontainer = null;

        /**
         * @ignore
         * @description
         * App pages that are currently loaded.
         * @type {Map<number,ViewerComponent>}
         */
        this.pages = new Map();

        /**
         * @ignore
         * @type {JQuery}
         */
        this.windows = null;

        /**
         * @description
         * Current error.
         * @type {Component}
         */
        this.currError = null;

        this.activePage = 0;

        // Lets upgrade alerts...
        setAlert({
            message: sweetalert.show,
            confirm: function(msg, callback, title, yescaption, nocaption) {
                sweetalert.show(msg, function() {
                    callback(true);
                });
            },
            error: function(msg) {
                sweetalert.show(msg, null, 'Application Error');
            }
        });
    }

    /**
     * Load the app into a container.
     * @param {JQuery} container JQuery element to load the app into.
     * @returns {AppComponent} Returns itself for chaining.
     */
    load(container) {

        let main = $('<div class="main"></div>').appendTo(container);

        $('body').addClass([isMobileDevice() ? 'mobile-app' : 'desktop-app']);

        // Add window toolbar.
        if (settings.windowMode)
            this.windows = $('<div class="main-windows"></div>').appendTo(main);

        // Load components.
        let header = new HeaderComponent();
        header.setTitle(settings.style.images.logo !== '' ?
            '<img class="navbar-logo" alt="' + settings.app.name + '" src="' +
            settings.style.images.logo + '" />' :
            settings.app.name);
        header.load(main);
        header.menuIcon.click(function() {
            header.showMenu();
        });

        this.maincontainer = $('<div class="container"></div>').appendTo(main);

        return this;
    }

    /**
     * Get the active viewer.
     * @returns {ViewerComponent} Returns the active viewer.
     */
    currentPage() {
        if (this.activePage > 0 && this.pages.has(this.activePage))
            return this.pages.get(this.activePage);
        return null;
    }

    /**
     * Load a page.
     * @param {string} name Name of the page to load.
     * @param {viewerOptions} [options] Page viewer options.
     * @param {Object} [params] Page params.
     * @returns {void}
     */
    loadPage(name, options = {}, params = {}) {

        let pge = new ViewerComponent(name, options, params);

        let curr = this.currentPage();
        if (!settings.windowMode && curr)
            this.closePage(curr.id);

        if (this.currError) {
            this.currError.unload();
            this.currError = null;
        }

        promisequeue(
            () => {

                if (this.currentPage())
                    this.currentPage().hide().hideLoad();

                // Add a window shorcut.
                if (settings.windowMode) {
                    $('.main-windows-btn').removeClass('active');
                    this.addWindowToToolbar(pge).addClass('active');
                }

                $('.placeholder-content').hide();

                // Load the page component.
                return pge.load(this.maincontainer);
            },
            () => {

                if (!settings.windowMode && window.history && options.updateHistory)
                    window.history.pushState(null, pge.title, options.updateHistory);

                // Add the page to the loaded pages.
                this.pages.set(pge.id, pge);
                this.activePage = pge.id;

                return pge.update();
            },
            () => {
                processLinks();
            }
        ).error(() => {
            pge.unload();
            this.pages.delete(pge.id);
            if (this.activePage === pge.id)
                this.activePage = 0;
            if (this.activePage)
                this.showPage(this.activePage);
        });
    }

    /**
     * Add a window to the windows toolbar.
     * @param {ViewerComponent} viewer Page viewer.
     * @returns {JQuery} Returns the shortcut button.
     */
    addWindowToToolbar(viewer) {
        const icons = getIcons(),
            closeBtn = $(icons.get('%close%'))
                .click((ev) => {
                    this.closePage(viewer.id);
                    ev.preventDefault();
                    return false;
                });
        return $('<div id="win' + viewer.id + '" class="main-windows-btn unselectable" data-ripple></div>')
            .hide()
            .appendTo(this.windows)
            .append('<span />')
            .append(closeBtn)
            .click(() => {
                this.showPage(viewer.id);
            })
            .fadeIn(300);
    }

    /**
     * Close an opened page.
     * @param {number} id ID of the page to close.
     * @returns {void}
     */
    closePage(id) {

        promisequeue(() => {

            // Unload the page.
            if (!this.pages.has(id))
                throw appError('nopage', 'Cannot find page by id \'{0}\'', id);

            const pge = this.pages.get(id);
            if (settings.windowMode && pge.page.noclose)
                return;
            pge.unload();

            // Remove the page from the loaded pages.
            this.pages.delete(id);

            // Remove shortcut.
            if (settings.windowMode) {
                $('#win' + id).remove();
                $(window).scrollTop(0);
            }

            if (this.activePage === id) {

                this.activePage = 0;

                // Open next page.
                if (this.pages.size > 0) {
                    const nextpge = Array.from(this.pages.values())[this.pages.size - 1];
                    this.showPage(nextpge.id);
                }
            }

        });
    }

    /**
     * Show a loaded page.
     * @param {number} id ID of the page to show.
     * @returns {void}
     */
    showPage(id) {

        promisequeue(() => {

            // Hide the currently active page.
            if (this.currentPage())
                this.currentPage().hide();

            if (settings.windowMode)
                $('.main-windows-btn').removeClass('active');

            // Show the page.
            if (!this.pages.has(id))
                throw appError('nopage', 'Cannot find page by id \'{0}\'', id);

            const pge = this.pages.get(id);
            pge.show();
            this.activePage = pge.id;

            if (settings.windowMode)
                $('#win' + id).addClass('active');
        });
    }

}

export default AppComponent;
