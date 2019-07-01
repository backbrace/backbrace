import $ from 'jquery';
import { SectionComponent } from '../sectioncomponent';

/**
 * @class
 * @extends {SectionComponent}
 * @description
 * Page component for displaying HTTP status messages.
 */
export class StatusPageComponent extends SectionComponent {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     * @param {pageSectionDesign} design Section design.
     */
    constructor(viewer, design) {

        super(viewer, design);

        this.title = null;

    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {StatusPageComponent} Promise to load the card.
     */
    load(container) {
        $('<div class="status-title">Oops!</div>').appendTo(container);
        this.description = $('<div class="status-description" />').appendTo(container);
        this.code = $('<div class="status-code" />').appendTo(container);
        return this;
    }

    /**
     * @description
     * Update the component.
     * @param {*} data Data to load.
     * @returns {Component} Returns itself for chaining.
     */
    update(data) {
        let d = $.grep(data, (val) => val.code === this.viewer.page.name);
        if (d.length === 0) {
            this.description.html('Status not found.');
        } else {
            this.code.html('Error code: <b>' + d[0].code + '</b>');
            this.description.html(d[0].description);
        }
        return this;
    }
}

export default StatusPageComponent;
