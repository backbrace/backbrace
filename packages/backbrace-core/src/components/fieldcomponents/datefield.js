import 'jquery-ui';
import 'npm/jquery-ui-dist/jquery-ui.css';

import { TextFieldComponent } from './textfield';

/**
 * @class
 * @extends {TextFieldComponent}
 * @description
 * Date field component.
 */
export class DateFieldComponent extends TextFieldComponent {

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

        super.load(container);

        this.control.datepicker();

        return this;
    }

}

export default DateFieldComponent;
