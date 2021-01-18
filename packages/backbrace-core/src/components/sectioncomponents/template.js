import handlebars from 'handlebars';
import dompurify from 'dompurify';

import { globals } from '../../globals';
import { Section } from '../section';
import { appState } from '../../state';

/**
 * @class Template
 * @augments Section
 * @description
 * Generic template component which renders a HTML template.
 */
export class Template extends Section {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['template', 'string']
        ]);
    }

    /**
     * @constructs Template
     */
    constructor() {

        super();

        /**
         * @description
         * HTML template string.
         * @type {string}
         */
        this.template = '';

        /**
         * @description
         * Clean HTML string.
         * @type {string}
         */
        this.cleanHTML = null;
    }

    /**
     * @override
     */
    render() {

        const context = { data: this.state.data, globals: globals, user: appState?.user };

        // Merge the template and context.
        let template = handlebars.compile(this.template);
        let html = template(context);

        // Double pass?
        if (html.includes('{{')) {
            template = handlebars.compile(html);
            html = template(context);
        }

        // Sanitize the html.
        this.cleanHTML = dompurify.sanitize(html, {
            ADD_ATTR: ['bb-route', 'bb-route-processed'],
            RETURN_TRUSTED_TYPE: true
        }).toString();

        return this.html`${this.unsafeHTML(this.cleanHTML)}`;
    }
}

export default Template;

Section.define('bb-template', Template);
