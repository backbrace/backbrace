import { Section } from './section';

/**
 * @class Container
 * @augments Section
 * @description
 * Container component base class. Uses bootstrap grid for layout.
 */
export class Container extends Section {

    /**
     * @constructs Container
     */
    constructor() {

        super();

        /**
         * @description
         * Attribute. Column layout. Defaults to `col-12`.
         * @type {string}
         */
        this.cols = 'col-12';
    }

    /**
     * Render the container content.
     * @returns {unknown} Returns the HTML template.
     */
    renderContent() {
        return '';
    }

    /**
     * @override
     */
    render() {
        return this.html`
            <div class="bb-container bg-surface">
                <div class="bb-title-bar unselectable"></div>
                <h6 class="bb-title unselectable cuttext">${this.design.caption}</h6>
                ${this.state.hasError ? this.html`<bb-error .err=${this.state.error}></bb-error>` : this.renderContent()}
            </div>
        `;
    }

}
