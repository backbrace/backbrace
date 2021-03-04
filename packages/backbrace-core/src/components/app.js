import 'reset-css/reset.css';
import '../styles/base.scss';

import $ from 'cash-dom';
import { configure } from 'mobx';

import './apptoolbar';
import './error';
import './header';
import './button';

import { Component } from './component';
import { init as initRouter } from '../route';
import { settings } from '../settings';
import { isMobileDevice } from '../util';
import { Page } from './page';

import { get as getWindow } from '../providers/window';
import { appState } from '../state';

/**
 * @class App
 * @augments Component
 * @description
 * App component.
 */
export class App extends Component {

    /**
     * @constructs App
     */
    constructor() {

        super();

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
         * UID of the active page.
         * @type {number}
         */
        this.activePage = 0;

        configure({ enforceActions: 'never' });
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

        if (!settings.windowMode) {
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

        // Load the page component.
        await pge.load();

        // Add a window shorcut.
        if (settings.windowMode)
            this.toolbar.addButton(pge);

        $(window)[0].scrollTop = 0;
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
        if (settings.windowMode) {
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

        if (settings.windowMode)
            this.toolbar.deselectButtons();

        // Show the page.
        if (!this.pages.has(id))
            throw this.error('nopage', `Cannot find page by id '${id}'`);

        const pge = this.pages.get(id);
        pge.show();
        this.activePage = pge.uid;

        if (settings.windowMode)
            this.toolbar.selectButton(id);
    }

    /**
     * @override
     */
    firstUpdated() {

        // Get our sub components.
        this.main = $(this).find('main');
        this.toolbar = this.querySelector('bb-apptoolbar');

        // Add mobile/desktop class.
        this.classList.add(isMobileDevice() ? 'mobile-app' : 'desktop-app');

        if (!settings.windowMode)
            initRouter();
    }

    /**
     * @override
     */
    render() {
        if (this.state.hasError)
            return this.html`<bb-error .err=${this.state.error}></bb-error>`;
        return this.html`
            ${!settings.auth.login || appState.isAuthenticated ?
                this.html`<bb-header logo=${settings.style.images.logo} logotext=${settings.app.name}></bb-header>` : ''}
            ${settings.windowMode ?
                this.html`<bb-apptoolbar></bb-apptoolbar>` : ''}
            <main class="container"></main>
        `;
    }

}

export default App;

Component.define('bb-app', App);
