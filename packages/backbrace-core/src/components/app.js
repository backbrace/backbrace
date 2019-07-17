import $ from 'jquery';
import 'npm/reset-css/reset.css';
import '../styles/base.scss';

import './fieldcomponent';
import './sectioncomponent';
import './actions';
import './window';

import { dataTable, addDataTable } from '../data';
import { error } from '../error';
import { addTable, addPage } from '../design';
import { promisequeue } from '../promises';
import { match as matchRoute } from '../route';
import { settings } from '../settings';
import * as sweetalert from '../sweetalert';
import { isMobileDevice } from '../util';
import { set as setAlert } from '../providers/alert';
import { Component } from './component';
import { HeaderComponent } from './header';
import { ViewerComponent } from './viewer';
import { pagedesign, tabledesign } from '../types';

const appError = error('appcomponent');

/**
 * Add a status page to the app.
 * @private
 * @param {string} code Status code.
 * @param {string} description Status description.
 * @returns {void}
 */
function addStatusPage(code, description) {
    let pge = $.extend({}, pagedesign),
        tbl = dataTable('status');
    pge.name = code;
    pge.component = 'statuspage';
    pge.tableName = 'builtin/status';
    addPage('status/' + code, pge);
    tbl.push({
        code: code,
        description: description
    });
}

/**
 * @class
 * @extends {Component}
 * @description
 * App component.
 */
export class AppComponent extends Component {

    /**
     * @constructor
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

        // Add status table.
        addDataTable('status');
        let tbl = tabledesign;
        tbl.name = 'status';
        tbl.data = 'datatable/status';
        addTable('builtin/status', tbl);

        // Add status pages.
        addStatusPage('400', 'Seems like a bad request has happened.');
        addStatusPage('404', 'We can\'t seem to find the page you were looking for.');

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

        promisequeue(
            () => {

                if (this.currentPage())
                    this.currentPage().hide().hideLoad();

                // Add a window shorcut.
                if (settings.windowMode) {
                    $('.main-windows-btn').removeClass('active');
                    this.addWindowToToolbar(pge.id).addClass('active');
                }

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
                //Process links.
                $('[route]').each((index, val) => {
                    var a = $(val);
                    if (a.attr('processed') === 'true')
                        return;
                    a.css('cursor', 'pointer').on('click', () => {
                        var r = matchRoute(a.attr('route'));
                        if (r)
                            this.loadPage(r.page, { updateHistory: a.attr('route') }, r.params);
                    }).attr('processed', 'true');
                });
            }
        ).error(() => {
            pge.unload();
            if (this.activePage)
                this.showPage(this.activePage);
        });
    }

    /**
     * Add a window to the windows toolbar.
     * @param {number} id ID of the window.
     * @returns {JQuery} Returns the shortcut button.
     */
    addWindowToToolbar(id) {
        return $('<div id="win' + id + '" class="main-windows-btn unselectable" data-ripple></div>')
            .hide()
            .appendTo(this.windows)
            .append('<span />')
            .click(() => {
                this.showPage(id);
            })
            .fadeIn(300)
            .ripple();
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
