import $ from 'jquery';
import { FieldComponent } from '../fieldcomponent';

/**
 * @class
 * @extends {FieldComponent}
 * @description
 * Textbox component.
 */
export class TextFieldComponent extends FieldComponent {

    /**
     * @constructor
     * @param {SectionComponent} parent Parent component.
     * @param {pageFieldDesign} field Field design.
     */
    constructor(parent, field) {
        super(parent, field);
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Conatiner to load into.
     * @returns {FieldComponent} Returns itself for chaining.
     */
    load(container) {

        const parent = this.parent.design.component;
        let type = 'text';

        super.load(container);

        if (parent === 'cardpage') {
            this.container.addClass('control-container col ' + this.field.className);
            this.label = $('<label for="cont' + this.id + '" class="control-label"></label>')
                .text(this.field.caption)
                .appendTo(this.container);
        }

        this.control = $('<input id="cont' + this.id + '" type="' + type +
            '" class="control-input"></input>')
            .appendTo(this.container);

        return this;
    }

}

export default TextFieldComponent;
