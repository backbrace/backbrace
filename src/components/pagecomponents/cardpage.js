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

        $.each(Array.from(this.subwindows.values()), (index, win) => win.unload());
        this.subwindows = null;

        $.each(Array.from(this.subpages.values()), (index, page) => page.unload());
        this.subpages = null;

        $.each(Array.from(this.fields.values()), (index, cont) => cont.unload());
        this.fields = null;

        super.unload();
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(cont) {
        return codeblock(
            () => this.loadSections(cont)
        );
    }

    /**
     * @description
     * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to return after we load the tabs.
     */
    loadSections(cont) {

        const page = this.viewer.page;

        return codeeach(page.sections, (section, i) => {

            if (section.pageName === '') { // Not a sub page.

                // Create the window.
                let win = this.viewer.window;
                if (i > 0) {
                    win = new WindowComponent({
                        className: section.className,
                        hasParent: true,
                        icon: section.icon
                    });
                    win.load(cont).setTitle(section.text);
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
                    return page.load(cont);
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
     * Update the card page with a data source.
     * @param {object[]} data Array of data.
     * @returns {JQueryPromise} Returns a promise to update the card page.
     */
    update(data) {

        // Only show the data for the first record.
        let r = null;
        if (data && data.length > 0)
            r = data[0];

        // Update the fields.
        return codeeach(Array.from(this.fields.values()), function(cont) {
            return cont.update(r);
        });
    }

    /**
     * @description
     * Show the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    show() {

        const $ = getJQuery();

        $.each(Array.from(this.subwindows.values()), (index, win) => win.show());
        $.each(Array.from(this.subpages.values()), (index, page) => page.show());

        return this;
    }

    /**
     * @description
     * Hide the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hide() {

        const $ = getJQuery();

        $.each(Array.from(this.subwindows.values()), (index, win) => win.hide());
        $.each(Array.from(this.subpages.values()), (index, page) => page.hide());

        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    showLoad() {

        const $ = getJQuery();

        super.showLoad();

        $.each(Array.from(this.subwindows.values()), (index, win) => win.loader.show());
        $.each(Array.from(this.subpages.values()), (index, page) => page.showLoad());

        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hideLoad() {

        const $ = getJQuery();

        super.hideLoad();

        $.each(Array.from(this.subwindows.values()), (index, win) => win.loader.hide());
        $.each(Array.from(this.subpages.values()), (index, page) => page.hideLoad());

        return this;
    }

    /**
     * Hide the preloader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hidePreLoad() {

        const $ = getJQuery();

        $.each(Array.from(this.subwindows.values()), (index, win) => {
            win.preloader.hide();
            // Remove the progress bars from sub windows.
            if (index > 0)
                win.loader.html('');
        });

        return this;
    }
}

export default CardPageComponent;
