import $ from 'cash-dom';
import Jimp from 'jimp/es';
import { Field } from '../field';
import { get as getStyle } from '../../providers/style';

/**
 * @class ImageLookup
 * @augments Field
 * @description
 * Image Lookup component.
 */
export class ImageLookup extends Field {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['icon', 'string']
        ]);
    }

    /**
     * @constructs ImageLookup
     */
    constructor() {

        super();

        /**
         * @description
         * Width of the component. Defaults to `100px`.
         * @type {string}
         */
        this.width = '100px';

        /**
         * @description
         * Width of the component. Defaults to `100px`.
         * @type {string}
         */
        this.height = '100px';

        /**
         * @description
         * Attribute. Icon to display at the bottom of the component.
         * @type {string}
         */
        this.icon = '';

        /**
         * @description
         * File input control
         * @type {import('cash-dom').Cash}
         */
        this.file = null;
    }

    /** @override */
    firstUpdated() {

        // Setup the file input.
        this.file = $(this).find('input');
        $(this).on('click', () => this.file[0].click());
    }

    /**
     * Upload an image.
     */
    upload() {

        const file = this.file?.[0].files?.[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            Jimp
                .read(reader.result.toString())
                .then((j) => {
                    j.scaleToFit(200, 200).getBase64Async(j.getMIME()).then((v) => {
                        this.value = v;
                    });
                });
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    /** @override */
    render() {

        const style = getStyle();

        super.render();

        const addPhoto = this.html`
            <div class="bb-image-lookup-icon">
                ${style.icon(this.icon)}
            </div>
        `;

        return this.html`
            <div class=${this.classMap({ 'bb-field': true, 'bb-field-error': this.state.hasError })}>
                <input type="file" style="display:none" @change=${this.upload}>
                <div class="bb-image-lookup-container shape-circle" style=${this.styleMap(
            {
                backgroundImage: `url(${this.value})`,
                width: this.width,
                height: this.height
            })}>
                    ${this.icon ? addPhoto : ''}
                </div>
                ${this.state.hasError ? this.html`<small>* ${this.state.error}</small>` : ''}
                ${this.helpertext && !this.state.hasError ? this.html`<small>${this.helpertext}</small>` : ''}
            </div>`;
    }

}

export default ImageLookup;

Field.define('bb-image-lookup', ImageLookup);
