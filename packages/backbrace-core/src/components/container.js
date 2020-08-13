import { Section } from './section';
import { Button } from './button';
import $ from 'cash-dom';
import { get as style } from '../providers/style';

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

        /**
         * @description
         * Actions.
         * @type {Map<string,Button>}
         */
        this.actions = new Map();
    }

    /**
     * @override
     */
    async load() {

        for (let action of this.design.actions) {
            let button = new Button();
            button.caption = action.text;
            button.icon = action.icon;
            button.classList.add('clickable');
            if (action.style)
                button.classList.add('bb-button-' + action.style);
            if (action.type === 'save') {
                button.addEventListener('click', () => {
                    this.save();
                });
            }
            this.actions.set(action.name, button);
        }

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
            <div class="bb-container" style=${this.styleMap({
            paddingBottom: this.design.actions.length > 0 ? '86px' : ''
        })}>
                ${this.state.isLoading && !this.state.hasError ? $(style().progress('save')) : null}
                <div class="bb-title-bar unselectable"></div>
                <h6 class="bb-title unselectable cuttext">${this.design.caption}</h6>
                ${this.state.hasError ? this.html`<bb-error .err=${this.state.error}></bb-error>` : this.renderContent()}
                ${this.design.actions.length > 0 ? this.html`<div class="bb-toolbar-bottom">${this.actions.values()}</div>` : ''}
            </div>
        `;
    }

}
