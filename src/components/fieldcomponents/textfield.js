import { get as getJQuery } from '../../providers/jquery';
import { FieldComponent } from '../../classes/fieldcomponent';

/**
 * @class
 * @extends {FieldComponent}
 * @description
 * Textbox component.
 */
export class TextFieldComponent extends FieldComponent {

    /**
     * @constructor
     * @param {PageComponent} parent Parent component.
     * @param {PageFieldMeta} field Field meta data.
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

        const $ = getJQuery(),
      parent = this.parent.viewer.page.component;
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
