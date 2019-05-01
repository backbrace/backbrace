import $ from 'jquery';
import { promiseblock, promisequeue } from '../promises';
import { dataTable } from '../data';
import { load as loadModule } from '../module';
import { error } from '../error';
import { get } from '../http';
import { page, table } from '../meta';
import { settings } from '../settings';
import { noop } from '../util';
import { Component } from '../classes/component';
import { ActionsComponent } from './actions';

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
     * @param {Object} [params] Page params.
     */
    constructor(name, { title, hasParent = false, temp = false, updateHistory = null } = {}, params = {}) {

        super();

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
        this.options = { title, hasParent, temp, updateHistory };

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
         * @type {any[]}
         */
        this.data = null;

        /**
         * @description
         * Page params.
         * @type {Object}
         */
        this.params = params;

        /**
         * @description
         * On before update of the viewer.
         * @type {DataCallback}
         */
        this.onBeforeUpdate = null;
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
        this.container.parent().remove();
        super.unload();
    }

    /**
     * @description
     * Load the viewer component.
     * @param {JQuery} container Container to load into.
     * @returns {JQueryPromise} Promise to load the viewer component.
     */
    load(container) {

        let cont = $('<div>').appendTo(container);

        super.load(cont);

        this.container.addClass('viewer');

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

                // Add actions.
                //this.actions.load(this.window.toolbar);
                $.each(this.page.actions, (i, action) => this.actions.addAction(action, (action, func) => {
                    this.actionRunner(action, func);
                }));

                // Load the page component.
                let comp = this.page.component;
                if (comp.indexOf('.js') === -1) {
                    return promiseblock(
                        () => {
                            return import(
                                /* webpackChunkName: "[request]" */
                                './pagecomponents/' + comp + '.js');
                        },
                        ({ default: Control }) => {
                    this.pageComponent = new Control(this);
                    return this.pageComponent.load(this.container);
                }
                    );
                }
            },

            () => {

                this.setTitle(this.options.title || this.page.caption);

                // Show the page.
                this.show();
            },

            // Get the page contoller (from file).
            () => {
                if (this.page.controller !== '')
                    return promiseblock(
                        () => loadModule(this.page.controller),
                        (mod) => mod(this)
                    );
            },

            // Get the table contoller (from file).
            this.table ?
                () => {
                    if (this.table.controller !== '')
                        return promiseblock(
                            () => loadModule(this.table.controller),
                            (mod) => mod(this)
                        );
                } : null,

            //() => this.update(),

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

                    // On before update.
                    return (this.onBeforeUpdate || noop)(this.data);
                },
                () => {
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

        // Show components.
        this.pageComponent.show();

        this.container.show();

        return this;
    }

    /**
     * @description
     * Hide the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    hide() {

        this.container.hide();

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
        this.pageComponent.setTitle(title);
        if (settings.windowMode) {
            $('#win' + this.id).find('span').html(`${title}`);
        } else {
            window.document.title = settings.app.title + (title !== '' ? ' - ' + title : '');
        }
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
