import $ from 'cash-dom';

import { Component } from './component';
import { fetch } from '../data';
import { page } from '../design';
import { settings } from '../settings';

import { get as style } from '../providers/style';

/**
 * @class Page
 * @augments Component
 * @description
 * Page component. Used to display a page.
 */
export class Page extends Component {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['pagename', 'string']
        ]);
    }

    /**
     * @constructs Page
     */
    constructor() {

        super();

        /**
         * @description
         * Name of the page.
         * @type {string}
         */
        this.name = '';

        /**
         * @description
         * Page caption.
         * @type {string}
         */
        this.caption = '';

        /**
         * @description
         * Page design.
         * @type {import('../types').pageDesign}
         */
        this.design = null;

        /**
         * @description
         * Page sections.
         * @type {Map<string, import('./section').Section>}
         */
        this.sections = new Map();

        /**
         * @description
         * Page params.
         * @type {Object}
         */
        this.params = {};

        /**
         * @description
         * Progress meter.
         * @type {import('cash-dom').Cash}
         */
        this.progress = $(style().progress());

        /**
         * @description
         * Sections container.
         * @type {import('cash-dom').Cash}
         */
        this.sectionContainer = null;
    }

    /**
     * @override
     */
    firstUpdated() {

        // Get our sub components.
        this.sectionContainer = $(this).find('.bb-sections');

    }

    /**
     * Get a section component by name.
     * @param {string} name Name or path of the component.
     * @returns {Promise<import('./section').Section>} Returns the section component.
     */
    async getSectionComponent(name) {

        let Component = null;

        if (!name)
            return null;

        if (!name.endsWith('.js')) {
            // Import built-in control.
            const { default: Control } = await import(
                /* webpackChunkName: "[request]" */
                `./sectioncomponents/${name}.js`);
            Component = Control;
        } else {
            // Import external component.
            const { default: Control } = await import(
                /* webpackIgnore: true */
                `${settings.dir.design}${name}`);
            Component = Control;
        }

        return new Component();
    }

    /**
     * @override
     */
    async load() {

        this.state.isLoading = true;

        // Get the page design.
        let p = await page(this.name);

        // Page design not found.
        if (p === null)
            throw this.error('nodesign', `Cannot find page design '${this.name}'`);

        this.design = p;

        // Set the caption of the page.
        this.setCaption(this.design.caption);

        // Add footer section.
        if (settings.app.footer)
            this.design.sections.push(settings.app.footer);

        // Get the page data.
        let pageData = null;
        if (this.design.data)
            pageData = await fetch(this.design.data, '');

        // Load the page sections.
        for (let sectionDesign of this.design.sections) {

            let section = await this.getSectionComponent(sectionDesign.component);

            // Setup the component.
            section.design = sectionDesign;
            section.params = this.params;

            // Get the section data.
            let sectionData = pageData;
            if (sectionDesign.data)
                sectionData = await fetch(sectionDesign.data, sectionDesign.query);

            // Check for errors.
            if (sectionData && sectionData.errors && sectionData.errors.length && sectionData.errors.length > 0 && sectionData.errors[0].message)
                throw this.error('fetch', `Fetch failed for section ${sectionDesign.name}. Error: ${sectionData.errors[0].message}`);

            // Bind data.
            let bindData = sectionData,
                ret = [];
            if (sectionDesign.bind)
                sectionDesign.bind.split('.').forEach((bprop) => {
                    if (bindData === null || typeof bindData[bprop] === 'undefined')
                        throw this.error('bind', `Data binding failed section ${sectionDesign.name} for ${sectionDesign.bind} on property ${bprop}`);
                    bindData = bindData[bprop];
                });
            if (bindData) {
                if (bindData.forEach) {
                    ret = ret.concat(bindData);
                } else {
                    ret.push(bindData);
                }
            }
            section.state.data = section.state.data.concat(ret);

            // Set the component attributes.
            section.setAttribute('name', sectionDesign.name);
            section.setAttributes();

            this.sectionContainer.append(section);
            this.sections.set(sectionDesign.name, section);

            await section.load();

        }

        this.state.isLoading = false;

        style().pageUpdated(this);
    }

    /**
     * @description
     * Set the caption of the page.
     * @param {string} caption Page caption.
     * @returns {void}
     */
    setCaption(caption) {

        this.caption = caption;

        this.fire('captionchange', {
            caption: caption,
            icon: this.design.icon
        });
    }

    /**
     * @override
     */
    render() {
        return this.html`
            ${this.state.isLoading && !this.state.hasError ? this.progress : null}
            ${this.state.hasError ? this.html`<bb-error .err=${this.state.error}></bb-error>` : ''}
            <div class="container" style=${this.styleMap({ visibility: this.state.isLoading ? 'hidden' : '' })}>
                <div class="bb-sections row"></div>
            </div>
        `;
    }

}

Component.define('bb-page', Page);
