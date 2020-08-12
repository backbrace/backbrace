import { Section } from './section';

/**
 * @class Container
 * @augments Section
 * @description
 * Container component base class. Uses bootstrap grid for layout.
 */
export class Container extends Section {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['cols', 'string']
        ]);
    }

    /**
     * @constructs Container
     */
    constructor() {

        super();

        /**
         * @description
         * Column layout. Defaults to `col-sm-12`.
         * @type {string}
         */
        this.cols = 'col-sm-12';
    }

    /**
     * Render the container content.
     * @returns {*} Returns the HTML template.
     */
    renderContent() {
    }

    /**
     * @override
     */
    render() {

        // Apply class.
        if (this.cols)
            this.cols.split(' ').forEach((c) => this.classList.add(c));

        return this.html`
            <div class="bb-container">
                <div class="bb-title-bar unselectable"></div>
                <h6 class="bb-title unselectable cuttext">${this.design.caption}</h6>
                <div class="row no-margin"></div>
                <div class="row">
                    ${this.state.hasError ? this.html`<bb-error message=${this.state.error.message}></bb-error>` : this.renderContent()}
                </div>
            </div>
        `;
    }

}
