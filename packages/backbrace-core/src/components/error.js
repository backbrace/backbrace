import { ShadowComponent } from './shadowcomponent';

/**
 * @class ErrorMessage
 * @augments ShadowComponent
 * @description
 * Error Component. Display an error message to the user.
 */
export class ErrorMessage extends ShadowComponent {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['message', 'string']
        ]);
    }

    /**
     * @constructs ErrorMessage
     */
    constructor() {

        super();

        /**
         * @description
         * Error mesage.
         * @type {string}
         */
        this.message = '';

        this.update();
    }

    /**
     * @override
     */
    render() {
        return this.html`
            <style>
                div{
                    padding: 30px;
                    overflow-wrap: break-word;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,Segoe UI Emoji, Segoe UI Symbol;
                }
                h1{
                    font-size: 120%;
                    font-weight:bold;
                    margin:8px 0 8px 0;
                }
            </style>
            <div>
                <h1>Oops, we had an issue.</h1>
                ${this.message}
            </div>
        `;
    }

}

ShadowComponent.define('bb-error', ErrorMessage);
