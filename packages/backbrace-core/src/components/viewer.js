import $ from 'jquery';
import { promiseblock, promiseeach } from '../promises';
import { load as loadModule } from '../module';
import { error } from '../error';
import { get } from '../http';
import { page, table } from '../design';
import { settings } from '../settings';
import { Component } from './component';
import { get as getIcons } from '../providers/icons';
import { get as getProgress } from '../providers/progress';

const viewerError = error('viewer');

/**
 * Get data from a data source.
 * @param {string} data Data source.
 * @param {tableDesign} [table] Table design.
 * @returns {JQueryPromise<any[]>} Promise to return the data.
 */
function getData(data, table) {
    if (data) {
        return promiseblock(
            () => {
                if (table) { // Load the data from a table.
                    if (table.data.endsWith('.json')) {
                        return get(table.data);
                    }
                } else { // Load from a JSON file.
                    if (data.endsWith('.json')) {
                        return get(data);
                    }
                }
            },
            (data) => {
                return data.data || data;
            }
        );
    }
}

/**
 * @class ViewerComponent
 * @extends {Component}
 * @description
 * Page viewer component. Used to display a page.
 */
export class ViewerComponent extends Component {

    /**
     * @constructs ViewerComponent
     * @param {string} name Page name.
     * @param {viewerOptions} [options] Viewer options.
     * @param {Object} [params] Page params.
     */
    constructor(name, { title, hasParent = false, updateHistory = null } = {}, params = {}) {

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
        this.options = { title, hasParent, updateHistory };

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
         * Progress meter.
         * @type {JQuery}
         */
        this.progress = null;

        /**
         * @description
         * Action click events.
         * @type {Map<string, genericFunction>}
         */
        this.click = new Map();
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        Array.from(this.sections.values()).forEach((cont) => cont.unload());
        this.sections = null;

        if (settings.windowMode)
            $('#win' + this.id).remove();

        if (this.progress)
            this.progress.remove();

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

        this.container.addClass('viewer row').hide();
        this.progress = $(getProgress()).appendTo(container);

        return promiseblock(

            // Get the page design.
            () => page(this.name),

            (page) => {

                // Page design not found.
                if (page === null)
                    throw viewerError('nodesign', 'Cannot find page design \'{0}\'', this.name);

                this.page = page;

                // No close?
                if (this.page.noclose && settings.windowMode)
                    $('#win' + this.id).find('i').remove();

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
                            this.page.sections.forEach(section => {
                                section.fields.forEach(field => {

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
                    return promiseblock(
                        () => {
                            if (!comp.endsWith('.js')) {
                                // Built-in component.
                                return import(
                                    /* webpackChunkName: "[request]" */
                                    './sectioncomponents/' + comp + '.js');
                            } else {
                                // External component.
                                return import(
                                    /* webpackIgnore: true */
                                    settings.dir.design + comp);
                            }
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

                });
            },

            () => this.setTitle(this.options.title || this.page.caption),

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

        );
    }

    /**
     * @description
     * Update the viewer.
     * @returns {JQueryPromise} Returns a promise to update the viewer.
     */
    update() {

        if (!this.shouldUpdate())
            return;

        this.showLoad();
        return promiseblock(

            () => {
                if (this.page.data)
                    return promiseblock(
                        () => getData(this.page.data, this.table),
                        data => {
                            this.data = data || [];
                        }
                    );
            },

            () => this.beforeUpdate(),

            () => {

                // Update the sections.
                return promiseeach(Array.from(this.sections.values()), (comp) => {
                    return promiseblock(

                        () => {
                            if (comp.design.data)
                                return getData(comp.design.data, null);
                        },

                        (data) => {
                            comp.data = data || this.data;
                            return comp.beforeUpdate();
                        },

                        () => comp.update(),

                        () => comp.afterUpdate()
                    );
                });
            },

            () => this.afterUpdate(),

            () => {

                this.hideLoad();

                // Hide the progress meter.
                if (this.progress) {
                    this.progress.remove();
                    this.progress = null;
                    this.show();
                }
            }
        );
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
