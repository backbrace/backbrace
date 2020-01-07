import $ from 'jquery';
import { load as loadModule } from '../module';
import { error } from '../error';
import { get } from '../http';
import { page } from '../design';
import { settings } from '../settings';
import { Component } from './component';
import { get as getIcons } from '../providers/icons';
import { get as getProgress } from '../providers/progress';

const viewerError = error('viewer');

/**
 * Get data from a data source.
 * @async
 * @param {string} data Data source.
 * @returns {Promise<any[]>} Returns the data.
 */
async function getData(data) {
    if (data) {
        // Load from a JSON file.
        if (data.endsWith('.json')) {
            let d = await get(data);
            return d.data || d;
        }
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
     * @async
     * @description
     * Load the viewer component.
     * @param {JQuery} container Container to load into.
     * @returns {Promise} Returns after loading the component.
     */
    async load(container) {

        super.load(container);

        this.container.addClass('viewer row').hide();
        this.progress = $(getProgress()).appendTo(container);

        // Get the page design.
        let p = await page(this.name);

        // Page design not found.
        if (p === null)
            throw viewerError('nodesign', 'Cannot find page design \'{0}\'', this.name);

        this.page = p;

        // No close?
        if (this.page.noclose && settings.windowMode)
            $('#win' + this.id).find('i').remove();

        // Load the page sections.
        for (let section of this.page.sections) {

            let comp = section.component,
                Component = null;

            if (!comp.endsWith('.js')) {
                // Import built-in control.
                const { default: Control } = await import(
                    /* webpackChunkName: "[request]" */
                    `./sectioncomponents/${section.component}.js`);
                Component = Control;
            } else {
                // Import external component.
                const { default: Control } = await import(
                    /* webpackIgnore: true */
                    `${settings.dir.design}${comp}`);
                Component = Control;
            }

            /** @type {SectionComponent} */
            let cont = new Component(this, section);
            this.sections.set(section.name, cont);

            await cont.load(this.container);
        }

        this.setTitle(this.options.title || this.page.caption);

        // Get the page contoller (from file).
        if (this.page.controller) {
            const mod = await loadModule(this.page.controller);
            await mod(this);
        }
    }

    /**
     * @async
     * @description
     * Update the viewer.
     * @returns {Promise} Returns after updating the viewer.
     */
    async update() {

        if (!this.shouldUpdate())
            return;

        this.showLoad();

        if (this.page.data) {
            let data = await getData(this.page.data);
            this.data = data || [];
        }

        await this.beforeUpdate();

        // Update the sections.
        for (let comp of this.sections.values()) {
            if (comp.design.data) {
                let data = await getData(comp.design.data);
                comp.data = data || this.data;
            } else {
                comp.data = this.data;
            }
            await comp.beforeUpdate();
            await comp.update();
            await comp.afterUpdate();
        }

        await this.afterUpdate();

        this.hideLoad();

        // Hide the progress meter.
        if (this.progress) {
            this.progress.remove();
            this.progress = null;
            this.show();
        }
    }

    /**
     * @description
     * Show the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    show() {

        this.container.show();

        // Show sections.
        Array.from(this.sections.values()).forEach((cont) => cont.show());

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
