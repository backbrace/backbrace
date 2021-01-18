import { Component } from './component';
import { get as getStyle } from '../providers/style';

/**
 * @class Button
 * @augments Component
 * @description
 * Button component base class.
 */
export class Button extends Component {

    /**
     * Component attributes.
     * @returns {Map<string,string>}
     */
    static attributes() {
        return new Map([
            ['icon', 'string'],
            ['caption', 'string']
        ]);
    }

    /**
     * @constructs Button
     */
    constructor() {

        super();

        /**
         * @description
         * Button icon.
         * @type {string}
         */
        this.icon = '';

        /**
         * @description
         * Button caption.
         * @type {string}
         */
        this.caption = '';
    }

    /**
     * @override
     */
    render() {
        const style = getStyle();
        return this.html`
            ${this.icon ? style.icon(this.icon) : ''}<span>${this.caption}</span>
        `;
    }

}

Component.define('bb-button', Button);
