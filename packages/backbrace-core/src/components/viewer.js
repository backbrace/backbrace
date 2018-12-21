import { closePage, addWindowToToolbar, currentPage } from '../app';
import { promiseblock, promisequeue } from '../promises';
import { load as loadController, get as getController } from '../controller';
import { dataTable } from '../data';
import { error } from '../error';
import { get } from '../http';
import { page, table } from '../meta';
import { settings } from '../settings';
import { isMobileDevice } from '../util';
import { get as getJQuery } from '../providers/jquery';
import { Component } from '../classes/component';
import { ActionsComponent } from './actions';
import { HeaderComponent } from './header';
import { WindowComponent } from './window';

const viewerError = error('viewer');

/**
 * @class
 * @extends {Component}
 * @description
 * Page viewer component. Used to display a page.
 */
export class ViewerComponent extends Component {

    /**
     * @constructor
     * @param {string} name Page name.
     * @param {ViewerOptions} [options] Viewer options.
     */
    constructor(name, { title, hasParent = false, first = false, temp = false } = {}) {

        super();

        /**
         * @description
         * Header component (mobile only).
         * @type {HeaderComponent}
         */
        this.header = null;

        /**
         * @description
         * Name of the page.
         * @type {string}
         */
        this.name = name;

        /**
         * @description
         * Page title.
         * @type {string}
         */
        this.title = '';

        /**
         * @description
         * Viewer options.
         * @type {ViewerOptions}
         */
        this.options = { title, hasParent, first, temp };

        /**
         * @description
         * Page meta data.
         * @type {PageMeta}
         */
        this.page = null;

        /**
         * @description
         * Table meta data.
         * @type {TableMeta}
         */
        this.table = null;

        /**
         * @description
         * The page's window component.
         * @type {WindowComponent}
         */
        this.window = new WindowComponent({});

        /**
         * @description
         * Page's shortcut button.
         * @type {JQuery}
         */
        this.shortcutBtn = null;

        /**
         * @description
         * Page actions component.
         * @type {ActionsComponent}
         */
        this.actions = new ActionsComponent();

        /**
         * @description
         * The component that renders over the entire window.
         * @type {PageComponent}
         */
        this.pageComponent = null;

        /**
         * @description
         * Data source of the viewer.
         * @type {object[]}
         */
        this.data = null;
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {
        // Unload sub components.
        this.pageComponent.unload();
        this.pageComponent = null;
        this.actions.unload();
        this.actions = null;
        this.window.unload();
        this.window = null;
        if (this.header)
            this.header.unload();
        this.header = null;
        this.container.parent().remove();
        // Unload DOM.
        if (this.shortcutBtn)
            this.shortcutBtn.remove();
        super.unload();
    }

    /**
     * @description
     * Load the viewer component.
     * @param {JQuery} container Container to load into.
     * @returns {JQueryPromise} Promise to load the viewer component.
     */
    load(container) {

        const $ = getJQuery();

        let cont = $('<div>').appendTo(container);

        // Load header (mobile only).
        if (!this.options.hasParent && isMobileDevice()) {
            this.header = new HeaderComponent({
                menuIcon: !this.options.first ? 'keyboard-backspace' : 'menu',
                attachMenu: this.options.first
            });
            this.header.load(cont);
            this.header.navbar.removeClass('fixed');
            if (this.options.first) {
                this.header.menuIcon.click(() => this.header.showMenu());
            } else {
                this.header.menuIcon.click(() => closePage(this.id));
            }
        }

        super.load(cont);

        this.container.addClass('viewer');

        if (isMobileDevice()) {
            cont.addClass('viewer-full');
            if (this.options.first)
                cont.css('left', '0');
        }

        return promiseblock(

            // Get the page meta data.
            () => page(this.name),

            (page) => {

                // Page meta data not found.
                if (page === null)
                    throw viewerError('nometa', 'Cannot find page meta data \'{0}\'', this.name);

                this.page = page;

                // Get the table meta data.
                if (this.page.tableName)
                    return promiseblock(
                        () => table(this.page.tableName),
                        (table) => {

                            // Table meta data not found.
                            if (table === null)
                                throw viewerError('nometa', 'Cannot find table meta data \'{0}\'', this.page.tableName);

                            this.table = table;

                            let getColumn = (name) => {
                                let columns = $.grep(this.table.columns, function(column) {
                                    return column.name === name;
                                });
                                return columns.length === 1 ? columns[0] : null;
                            };

                            // Merge page and table fields.
                            $.each(this.page.sections, function(index, section) {
                                $.each(section.fields, function(index, field) {

                                    let col = getColumn(field.name);
                                    if (col) {
                                        if (field.caption === field.name)
                                            field.caption = col.caption;
                                        field.type = col.type;
                                    }
                                });
                            });
                        }
                    );
            },

            () => {

                // Hide the current page.
                if (currentPage() && !isMobileDevice())
                    currentPage().hide();

                // Load the window.
                if (this.options.hasParent) {
                    this.window.options.hasParent = true;
                    this.window.options.icon = this.page.icon;
                }
                this.window.load(this.container);

                // Add the page to the windows toolbar.
                if (settings.windowMode && !this.options.hasParent) {
                    this.shortcutBtn = addWindowToToolbar(this.id);
                }

                this.setTitle(this.options.title || this.page.caption);

                // Add title bar buttons.
                if (!isMobileDevice()) {
                    this.window.addTitlebarIcon('%refresh%', (() => promisequeue(() => this.update())));
                }
                // Add close function.
                this.window.options.onClose = () => closePage(this.id);

                // Add actions.
                this.actions.load(this.window.toolbar);
                $.each(this.page.actions, (i, action) => this.actions.addAction(action, (action, func) => {
                    this.actionRunner(action, func);
                }));

                // Load the page component.
                let comp = this.page.component;
                if (comp.indexOf('.js') === -1) {
                    let Control = require('./pagecomponents/' + comp + '.js').default;
                    this.pageComponent = new Control(this);
                    return this.pageComponent.load(this.container);
                }
            },

            () => {

                // Hide the current page.
                if (currentPage() && isMobileDevice())
                    currentPage().hide();

                // Show the page.
                this.show();
            },

            // Get the page contoller (from file).
            () => {
                if (this.page.controller !== '')
                    return promiseblock(
                        () => loadController(this.page.controller),
                        () => getController(this.page.controller)(this)
                    );
            },

            // Get the table contoller (from file).
            this.table ?
                () => {
                    if (this.table.controller !== '')
                        return promiseblock(
                            () => loadController(this.table.controller),
                            () => getController(this.table.controller)(this)
                        );
                } : null,

            () => this.update(),

            () => {
                this.pageComponent.hidePreLoad();
            }

        );
    }

    /**
     * @description
     * Update the viewer.
     * @returns {JQueryPromise} Returns a promise to update the viewer.
     */
    update() {

        if (this.table) {
            this.showLoad();
            return promiseblock(
                () => {
                    // Load the data source from a file.
                    if (this.table.data.indexOf('.json') !== -1) {
                        return get(this.table.data);
                    } else if (this.table.data.indexOf('datatable/') === 0) {
                        return {
                            data: dataTable(this.table.data.substr(10))
                        };
                    }
                },
                (data) => {

                    // Save the data.
                    this.data = data.data || data;

                    // Update the page component.
                    return this.pageComponent.update(this.data);
                },
                () => {
                    this.hideLoad();
                }
            );
        }
    }

    /**
     * @description
     * Run a page action.
     * @param {PageActionMeta} action Action meta data.
     * @param {Function} func Function to run.
     * @returns {void}
     */
    actionRunner(action, func) {

        this.showLoad();

        promisequeue(() => {
            return promiseblock(
                func ? function() {
                    return func();
                } : null,
                () => {
                    this.hideLoad();
                }
            );
        });
    }

    /**
     * @description
     * Show the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    show() {

        this.window.show();
        if (this.shortcutBtn)
            this.shortcutBtn.addClass('active');

        // Show components.
        this.pageComponent.show();

        this.container.show();

        this.animateIn();

        return this;
    }

    /**
     * @description
     * Hide the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    hide() {

        if (isMobileDevice()) {
            this.actions.hide();
            this.animateOut();
            return this;
        }

        this.container.hide();
        this.window.hide();
        if (this.shortcutBtn)
            this.shortcutBtn.removeClass('active');

        // Hide components.
        this.pageComponent.hide();

        return this;
    }

    /**
     * @description
     * Set the title of the page.
     * @param {string} title Title to change to.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    setTitle(title) {
        this.title = title;
        this.window.setTitle(title);
        if (this.shortcutBtn)
            this.shortcutBtn.find('span').html(`${title}`);
        if (this.header && !this.options.first)
            this.header.setTitle(title);
        return this;
    }

    /**
     * @description
     * Animate the page into view (mobile only).
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    animateIn() {
        if (!isMobileDevice() || this.options.hasParent)
            return this;
        let cont = this.container.parent();
        cont.show().animate({
            left: '0px'
        }, null, null, () => {
            this.actions.show();
        });
        return this;
    }

    /**
     * @description
     * Animate the page out of view (mobile only).
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    animateOut() {
        if (!isMobileDevice() || this.options.hasParent)
            return this;
        let cont = this.container.parent();
        cont.animate({
            left: '-100vw'
        });
        return this;
    }

    /**
     * Show the loader.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    showLoad() {
        this.pageComponent.showLoad();
        return this;
    }

    /**
     * Hide the loader.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    hideLoad() {
        this.pageComponent.hideLoad();
        return this;
    }

}
