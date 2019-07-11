import $ from 'jquery';
import { promiseblock, promiseeach } from '../promises';
import { dataTable } from '../data';
import { load as loadModule } from '../module';
import { error } from '../error';
import { get } from '../http';
import { page, table } from '../design';
import { settings } from '../settings';
import { Component } from './component';
import { get as getIcons } from '../providers/icons';

const viewerError = error('viewer');

/**
 * Get data from a data source.
 * @param {string} data Data source.
 * @param {tableDesign} [table] Table design.
 * @param {dataCallback} [dataCallback] Data callback.
 * @returns {JQueryPromise<any[]>} Promise to return the data.
 */
function getData(data, table, dataCallback) {
    if (data) {
        return promiseblock(
            () => {
                if (table) { // Load the data from a table.
                    if (table.data.endsWith('.json')) {
                        return get(table.data);
                    } else if (table.data.indexOf('datatable/') === 0) {
                        return {
                            data: dataTable(table.data.substr(10))
                        };
                    }
                } else { // Load from a JSON file.
                    if (data.endsWith('.json')) {
                        return get(data);
                    }
                }
            },
            (data) => {
                data = data.data || data;
                if (dataCallback)
                    return dataCallback(data);
                return data;
            }
        );
    }
}

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
     * @param {viewerOptions} [options] Viewer options.
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
         * @type {viewerOptions}
         */
        this.options = { title, hasParent, temp, updateHistory };

        /**
         * @description
         * Page design.
         * @type {pageDesign}
         */
        this.page = null;

        /**
         * @description
         * Table design.
         * @type {tableDesign}
         */
        this.table = null;

        /**
         * @description
         * Data source of the viewer.
         * @type {any[]}
         */
        this.data = null;

        /**
         * @description
         * Page sections.
         * @type {Map<string, SectionComponent>}
         */
        this.sections = new Map();

        /**
         * @description
         * Page params.
         * @type {Object}
         */
        this.params = params;

        /**
         * @description
         * Viewer events.
         * @type {viewerEvents}
         */
        this.events = {
            beforeUpdate: null,
            actionClick: new Map()
        };
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        Array.from(this.sections.values()).forEach((cont) => cont.unload());
        this.sections = null;

        this.container.remove();
        super.unload();
    }

    /**
     * @description
     * Load the viewer component.
     * @param {JQuery} container Container to load into.
     * @returns {JQueryPromise} Promise to load the viewer component.
     */
    load(container) {

        super.load(container);

        this.container.addClass('viewer row');

        return promiseblock(

            // Get the page design.
            () => page(this.name),

            (page) => {

                // Page design not found.
                if (page === null)
                    throw viewerError('nodesign', 'Cannot find page design \'{0}\'', this.name);

                this.page = page;

                // Get the page data.
                if (this.page.data && !this.page.data.endsWith('.json'))
                    return promiseblock(
                        () => table(this.page.data),
                        (table) => {

                            // Table design not found.
                            if (table === null)
                                throw viewerError('nodesign', 'Cannot find table design \'{0}\'', this.page.data);

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

                // Load the page sections.
                return promiseeach(this.page.sections, (section) => {

                    let comp = section.component;
                    if (comp.indexOf('.js') === -1) {
                        return promiseblock(
                            () => {
                                return import(
                                    /* webpackChunkName: "[request]" */
                                    './sectioncomponents/' + comp + '.js');
                            },
                            ({ default: Control }) => {
                                /**
                                 * @ignore
                                 * @type {SectionComponent}
                                 */
                                let cont = new Control(this, section);
                                this.sections.set(section.name, cont);
                                return cont.load(this.container);
                            }
                        );
                    }

                });
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
                Array.from(this.sections.values()).forEach((cont) => cont.hidePreLoad());
            }

        );
    }

    /**
     * @description
     * Update the viewer.
     * @returns {JQueryPromise} Returns a promise to update the viewer.
     */
    update() {

        if (this.page.data) {
            this.showLoad();
            return promiseblock(
                () => {
                    return getData(this.page.data, this.table, this.events.beforeUpdate);
                },
                (data) => {

                    // Save the data.
                    this.data = data;

                    // Update the sections.
                    return promiseeach(Array.from(this.sections.values()), (comp) => {

                        if (comp.design.data) {
                            return promiseblock(
                                () => getData(comp.design.data, null, comp.events.beforeUpdate),
                                (data) => comp.update(data)
                            );
                        }
                        return comp.update(this.data);
                    });
                },
                () => {
                    this.hideLoad();
                }
            );
        }
    }

    /**
     * @description
     * Show the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    show() {

        // Show sections.
        Array.from(this.sections.values()).forEach((cont) => cont.show());

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

        // Hide sections.
        Array.from(this.sections.values()).forEach((cont) => cont.hide());

        return this;
    }

    /**
     * @description
     * Set the title of the page.
     * @param {string} title Title to change to.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    setTitle(title) {

        const icons = getIcons();
        this.title = title;

        if (settings.windowMode) {
            $('#win' + this.id).find('span').html(`${icons.get(this.page.icon)} ${title}`);
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
        Array.from(this.sections.values()).forEach((cont) => cont.showLoad());
        return this;
    }

    /**
     * Hide the loader.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    hideLoad() {
        Array.from(this.sections.values()).forEach((cont) => cont.hideLoad());
        return this;
    }

}
