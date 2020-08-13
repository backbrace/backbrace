import 'reset-css/reset.css';
import '../styles/base.scss';

import $ from 'cash-dom';

import './apptoolbar';
import './error';
import './header';

import { AppErrorHandler } from '../apperrorhandler';
import { Component } from './component';
import { init as initRouter } from '../route';
import { settings } from '../settings';
import { isMobileDevice } from '../util';
import { Page } from './page';

import { get as getErrorHandler, set as setErrorHandler } from '../providers/error';
import { get as getStyle } from '../providers/style';
import { get as getWindow } from '../providers/window';

/**
 * @class App
 * @augments Component
 * @description
 * App component.
 */
export class App extends Component {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['windowmode', 'boolean']
        ]);
    }

    /**
     * @constructs App
     */
    constructor() {

        super();

        /**
         * @description
         * Attribute. Set to true to enable window mode.
         * @type {boolean}
         */
        this.windowmode = false;

        /**
         * @ignore
         * @description
         * App pages that are currently loaded.
         * @type {Map<number,Page>}
         */
        this.pages = new Map();

        /**
         * @ignore
         * @type {import('cash-dom').Cash}
         */
        this.main = null;

        /**
         * @description
         * App toolbar component (windowed mode only).
         * @type {import('./apptoolbar').AppToolbar}
         */
        this.toolbar = null;

        /**
         * @description
         * Header component.
         * @type {import('./header').Header}
         */
        this.header = null;

        /**
         * @description
         * UID of the active page.
         * @type {number}
         */
        this.activePage = 0;
    }

    /**
     * Get the active page.
     * @returns {Page}
     */
    currentPage() {
        if (this.activePage > 0 && this.pages.has(this.activePage))
            return this.pages.get(this.activePage);
        return null;
    }

    /**
     * Load a page.
     * @async
     * @param {string} name Name of the page to load.
     * @param {Object} [params] Page params.
     * @returns {Promise<void>}
     */
    async loadPage(name, params = {}) {

        const window = getWindow();

        let pge = new Page();

        try {

            if (!this.windowmode) {
                // Routing mode can only have 1 loaded page...
                if (this.currentPage())
                    this.currentPage().remove();
                pge.uid = 1;
            } else {
                this.toolbar.deselectButtons();
                if (this.currentPage()) {
                    this.currentPage().hide();
                }
            }

            pge.params = params;
            pge.setAttribute('name', name);
            this.main.append(pge);

            // Add the page to the loaded pages.
            this.pages.set(pge.uid, pge);
            this.activePage = pge.uid;

            // Caption change event.
            pge.on('captionchange', (e) => {
                if (!this.windowmode) {
                    window.document.title = `${settings.app.title}${e.detail.caption ? ' - ' + e.detail.caption : ''}`;
                }
            });

            // Load the page component.
            await pge.load();

            // Add a window shorcut.
            if (this.windowmode)
                this.toolbar.addButton(pge);

            $(window)[0].scrollTop = 0;

        } catch (e) {
            getErrorHandler().handleError(e);
        }

    }

    /**
     * Close an opened page.
     * @param {number} id ID of the page to close.
     * @returns {void}
     */
    closePage(id) {

        const window = getWindow();

        if (!this.pages.has(id))
            return;

        const pge = this.pages.get(id);
        pge.remove();

        // Remove the page from the loaded pages.
        this.pages.delete(id);

        // Remove shortcut.
        if (this.windowmode) {
            this.toolbar.removeButton(id);
            $(window)[0].scrollTop = 0;
        }

        if (this.activePage === id) {

            this.activePage = 0;

            // Open next page.
            if (this.pages.size > 0) {
                const nextpge = Array.from(this.pages.values())[this.pages.size - 1];
                this.showPage(nextpge.uid);
            }
        }
    }

    /**
     * Show a loaded page.
     * @param {number} id ID of the page to show.
     * @returns {void}
     */
    showPage(id) {

        // Hide the currently active page.
        if (this.currentPage())
            this.currentPage().hide();

        if (this.windowmode)
            this.toolbar.deselectButtons();

        // Show the page.
        if (!this.pages.has(id))
            throw this.error('nopage', `Cannot find page by id '${id}'`);

        const pge = this.pages.get(id);
        pge.show();
        this.activePage = pge.uid;

        if (this.windowmode)
            this.toolbar.selectButton(id);
    }

    /**
     * @override
     */
    firstUpdated() {

        // Get our sub components.
        this.main = $(this).find('.bb-main');
        this.toolbar = this.querySelector('bb-apptoolbar');
        this.header = this.querySelector('bb-appheader');

        // Set providers.
        setErrorHandler(new AppErrorHandler());

        // Add mobile/desktop class.
        this.classList.add(isMobileDevice() ? 'mobile-app' : 'desktop-app');

        if (!this.windowmode)
            initRouter();
    }

    /**
     * @override
     */
    render() {
        return this.html`
            <bb-header logo="${settings.style.images.logo}" logotext="${settings.app.name}"></bb-header>
            <bb-apptoolbar style="${this.windowmode ? '' : 'display:none'}"></bb-apptoolbar>
            <div class="bb-main container"></div>
        `;
    }

}

export default App;

Component.define('bb-app', App);
