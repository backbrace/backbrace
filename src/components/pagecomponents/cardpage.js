import { codeblock, codeeach } from '../../code';
import { get as getJQuery } from '../../providers/jquery';
import { PageComponent } from '../../classes/pagecomponent';
import { ViewerComponent } from '../viewer';
import { WindowComponent } from '../window';
import { isMobileDevice } from '../../util';

/**
 * @class
 * @extends {PageComponent}
 * @description
 * Card component class.
 */
export class CardPageComponent extends PageComponent {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     */
    constructor(viewer) {

        super(viewer);

        /**
         * @description
         * Sub window components.
         * @type {Map<string, WindowComponent>}
         */
        this.subwindows = new Map();

        /**
         * @description
         * Sub page components.
         * @type {Map<string, ViewerComponent>}
         */
        this.subpages = new Map();

        /**
         * @description
         * Sub control components.
         * @type {Map<string, Component>}
         */
        this.controls = new Map();

        /**
         * @description
         * Left column container.
         * @type {JQuery}
         */
        this.leftColumn = null;

        /**
         * @description
         * Right column container.
         * @type {JQuery}
         */
        this.rightColumn = null;
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        const $ = getJQuery();

        $.each(this.subwindows, function(index, win) {
            win.unload();
        });
        this.subwindows = null;

        $.each(this.subpages, function(index, page) {
            page.unload();
        });
        this.subpages = null;

        $.each(this.controls, function(index, cont) {
            cont.unload();
        });
        this.controls = null;

        super.unload();
    }

    /**
     * @description
     * Load the component.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load() {
        return codeblock(
            () => this.loadFields(''),
            () => this.loadTabs()
        );
    }

    /**
     * @description
     * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
     * @returns {JQueryPromise} Promise to return after we load the tabs.
     */
    loadTabs() {

        const page = this.viewer.page;

        return codeeach(page.tabs, (tab) => {

            let classes = 'window-width-full';

            if (tab.pageName === '') { // Not a sub page.

                // Create the window.
                let win = new WindowComponent({
                    className: classes,
                    hasParent: true,
                    icon: tab.icon
                });
                win.load(this.viewer.container).setTitle(tab.text);

                this.subwindows.set(tab.name, win);
                return this.loadFields(tab.name);

            } else {

                if (!isMobileDevice()) {
                    // Create sub page.
                    let page = new ViewerComponent(tab.pageName, {
                        hasParent: true
                    });
                    this.subpages.set(tab.name, page);
                    return page.load(this.viewer.container);
                }
            }
        });
    }

    /**
     * @description
     * Load the fields for a tab.
     * @param {string} tab Tab name.
     * @returns {JQueryPromise} Promise to return after we load the fields.
     */
    loadFields(tab) {

        const $ = getJQuery(),
            page = this.viewer.page,
            fields = $.grep(page.fields, function(field) {
                return field.tab === tab;
            });

        return codeeach(fields, (field, i) => {

            let comp = field.component,
                win = this.viewer.window;

            if (tab !== '' && this.subwindows.has(tab))
                win = this.subwindows.get(tab);

            if (comp === '') {
                comp = 'textfield';
            }
            if (comp.indexOf('.js') === -1) {

                let Control = require('../fieldcomponents/' + comp + '.js').default,
                    cont = new Control(this, field);
                this.controls.set(field.name, cont);

                return cont.load(win.main);
            }
        });
    }

    /**
     * @description
     * Show the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    show() {

        // Show the sub pages.
        for (let page of this.subpages.entries()) {
            page[1].show();
        }

        // Show the sub windows.
        for (let win of this.subwindows.entries()) {
            win[1].show();
        }

        return this;
    }

    /**
     * @description
     * Hide the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hide() {

        const $ = getJQuery();

        // Hide the sub pages.
        $.each(this.subpages, function(index, page) {
            page.hide();
        });

        // Hide the sub windows.
        $.each(this.subwindows, function(index, win) {
            win.hide();
        });

        return this;
    }

}

export default CardPageComponent;
