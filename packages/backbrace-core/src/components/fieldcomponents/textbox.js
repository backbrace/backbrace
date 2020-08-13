import { Field } from '../field';

/**
 * @class Textbox
 * @augments Field
 * @description
 * Textbox component.
 */
export class Textbox extends Field {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['type', 'string'],
            ['autocomplete', 'string']
        ]);
    }

    /**
     * @constructs Textbox
     */
    constructor() {

        super();

        /**
         * @description
         * Attribute. Type of textbox.
         * @type {string}
         */
        this.type = 'text';

        /**
         * @description
         * Attribute. Auto complete attribute.
         * @type {string}
         */
        this.autocomplete = '';
    }

    /** @override */
    render() {

        super.render();

        const setFocus = () => { this.state.hasFocus = true; },
            setBlur = () => { this.state.hasFocus = false; },
            onChange = (ev) => {
                this.value = ev.target.value;
            };

        return this.html`
            <div class=${this.classMap({ 'bb-field': true, 'bb-field-error': this.state.hasError })}>
                <input name=${this.design.name} type=${this.type} value=${this.value}
                    @focus=${setFocus} @blur=${setBlur} @change=${onChange} ?readonly=${this.state.isLoading} autocomplete=${this.autocomplete} />
                <label class=${this.classMap({ 'bb-field-filled': this.value || this.state.hasFocus, 'bb-field-focus': this.state.hasFocus })}>
                    ${this.caption}
                </label>
                ${this.state.hasError ? this.html`<small>* ${this.state.error}</small>` : ''}
                ${this.helpertext && !this.state.hasError ? this.html`<small>${this.helpertext}</small>` : ''}
            </div>`;
    }

}

export default Textbox;

Field.define('bb-textbox', Textbox);
