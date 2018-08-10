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
         * Field components.
         * @type {Map<string, Component>}
         */
        this.fields = new Map();
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

        $.each(this.fields, function(index, cont) {
            cont.unload();
        });
        this.fields = null;

        super.unload();
    }

    /**
     * @description
     * Load the component.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load() {
        return codeblock(
            () => this.loadSections()
        );
    }

    /**
     * @description
     * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
     * @returns {JQueryPromise} Promise to return after we load the tabs.
     */
    loadSections() {

        const page = this.viewer.page;

        return codeeach(page.sections, (section, i) => {

            let classes = 'window-width-full';

            if (section.pageName === '') { // Not a sub page.

                // Create the window.
                let win = this.viewer.window;
                if (i > 0) {
                    win = new WindowComponent({
                        className: classes,
                        hasParent: true,
                        icon: section.icon
                    });
                    win.load(this.viewer.container).setTitle(section.text);
                }
                this.subwindows.set(section.name, win);
                return this.loadFields(win, section.fields);

            } else {

                if (!isMobileDevice()) {
                    // Create sub page.
                    let page = new ViewerComponent(section.pageName, {
                        hasParent: true
                    });
                    this.subpages.set(section.name, page);
                    return page.load(this.viewer.container);
                }
            }
        });
    }

    /**
     * @description
     * Load the fields for a section.
     * @param {WindowComponent} win Window to load the fields into.
     * @param {PageFieldMeta[]} fields Fields to load.
     * @returns {JQueryPromise} Promise to return after we load the fields.
     */
    loadFields(win, fields) {

        return codeeach(fields, (field, i) => {

            let comp = field.component;

            if (comp === '') {
                comp = 'textfield';
            }
            if (comp.indexOf('.js') === -1) {

                let Control = require('../fieldcomponents/' + comp + '.js').default,
                    cont = new Control(this, field);
                this.fields.set(field.name, cont);

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

        // Hide the sub pages.
        for (let page of this.subpages.entries()) {
            page[1].hide();
        }

        // Hide the sub windows.
        for (let win of this.subwindows.entries()) {
            win[1].hide();
        }

        return this;
    }

}

export default CardPageComponent;