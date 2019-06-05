import { promiseblock, promiseeach } from '../../promises';
import { ActionsComponent } from '../actions';
import { PageComponent } from '../../classes/pagecomponent';
import { ViewerComponent } from '../viewer';
import { WindowComponent } from '../window';
import { isMobileDevice } from '../../util';
import { closePage } from '../../app';

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

        Array.from(this.subwindows.values()).forEach((win) => win.unload());
        this.subwindows = null;

        Array.from(this.subpages.values()).forEach((page) => page.unload());
        this.subpages = null;

        Array.from(this.fields.values()).forEach((cont) => cont.unload());
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
        return promiseblock(
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

        return promiseeach(page.sections, (section, i) => {

            if (section.pageName === '') { // Not a sub page.

                // Create the window.
                let win = new WindowComponent({
                    className: section.className,
                    hasParent: i > 0,
                    icon: section.icon,
                    onClose: () => closePage(this.viewer.id)
                });
                win.load(cont).setTitle(section.text);

                // Add actions.
                let actions = new ActionsComponent();
                actions.load(win.toolbar);
                section.actions.forEach((action) => actions.addAction(action, (action) => {
                    this.viewer.actionRunner(action);
                }));

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
     * @param {pageFieldDesign[]} fields Fields to load.
     * @returns {JQueryPromise} Promise to return after we load the fields.
     */
    loadFields(win, fields) {

        return promiseeach(fields, (field, i) => {

            let comp = field.component;

            if (comp === '') {
                comp = 'textfield';
            }
            if (comp.indexOf('.js') === -1) {

                return promiseblock(

                    () => {
                        return import(
                            /* webpackChunkName: "[request]" */
                            `../fieldcomponents/${comp}.js`);
                    },
                    ({ default: Control }) => {

                        let cont = new Control(this, field);
                        this.fields.set(field.name, cont);

                        return cont.load(win.main);
                    }

                );
            }
        });
    }

    /**
     * @description
     * Update the card page with a data source.
     * @param {Object[]} data Array of data.
     * @returns {JQueryPromise} Returns a promise to update the card page.
     */
    update(data) {

        // Only show the data for the first record.
        let r = null;
        if (data && data.length > 0)
            r = data[0];

        return promiseblock(
            () => {
                // Update the fields.
                return promiseeach(Array.from(this.fields.values()), function(cont) {
                    return cont.update(r);
                });
            },
            () => {
                // Update the sub pages.
                return promiseeach(Array.from(this.subpages.values()), function(page) {
                    return page.update();
                });
            }
        );
    }

    /**
     * @description
     * Set the title of the page.
     * @param {string} title Title to change to.
     * @returns {CardPageComponent} Returns itself for chaining.
     */
    setTitle(title) {
        let wins = Array.from(this.subwindows.values());
        if (wins.length > 0)
            wins[0].setTitle(title);
        return this;
    }

    /**
     * @description
     * Show the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    show() {

        Array.from(this.subwindows.values()).forEach((win) => win.show());
        Array.from(this.subpages.values()).forEach((page) => page.show());

        return this;
    }

    /**
     * @description
     * Hide the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hide() {

        Array.from(this.subwindows.values()).forEach((win) => win.hide());
        Array.from(this.subpages.values()).forEach((page) => page.hide());

        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    showLoad() {

        super.showLoad();

        Array.from(this.subwindows.values()).forEach((win) => win.loader.show());
        Array.from(this.subpages.values()).forEach((page) => page.showLoad());

        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hideLoad() {

        super.hideLoad();

        Array.from(this.subwindows.values()).forEach((win) => win.loader.hide());
        Array.from(this.subpages.values()).forEach((page) => page.hideLoad());

        return this;
    }

    /**
     * Hide the preloader.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hidePreLoad() {

        Array.from(this.subwindows.values()).forEach((win, index) => {
            win.preloader.hide();
            // Remove the progress bars from sub windows.
            if (index > 0)
                win.loader.html('');
        });

        return this;
    }
}

export default CardPageComponent;
