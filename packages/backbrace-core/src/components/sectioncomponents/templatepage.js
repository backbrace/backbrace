import $ from 'jquery';
import { globals } from '../../globals';
import { SectionComponent } from '../sectioncomponent';

/**
 * @class TemplatePageComponent
 * @extends {SectionComponent}
 * @description
 * Generic page component which renders a HTML template.
 */
export class TemplatePageComponent extends SectionComponent {

    /**
     * @constructs TemplatePageComponent
     * @param {ViewerComponent} viewer Viewer component.
     * @param {pageSectionDesign} design Section design.
     */
    constructor(viewer, design) {
        super(viewer, design);
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {SectionComponent|JQueryPromise} Promises to load the component.
     */
    load(cont) {

        this.template = this.design.options.template;

        if (this.design.options.useWindowComponent) {
            return super.load(cont);
        } else {
            this.container = $('<div style="width:100%" />').appendTo(cont);
            return this.attachController();
        }
    }

    /**
     * @description
     * Update the component.
     * @returns {TemplatePageComponent} Returns itself for chaining.
     */
    update() {

        let depth = 0;

        /**
         * Merge data with the template.
         * @ignore
         * @param {string} templ HTML template.
         * @param {any} d Data to merge.
         * @returns {string} Returns the merged template.
         */
        function mergeData(templ, d) {

            if (depth > 10)
                return templ;

            let s = templ,
                check = new RegExp('\\{\\{((.*?))\\}\\}', 'g'),
                fields = s.match(check);
            if (fields)
                fields.forEach(function(f) {
                    let fieldname = f.replace(check, '$1');
                    // Merge global variables.
                    if (fieldname.startsWith('globals.')) {
                        s = s.replace('{{' + fieldname + '}}', globals[fieldname.replace('globals.', '')]);
                    } else {
                        s = s.replace('{{' + fieldname + '}}', d[fieldname] || '');
                    }
                });

            let depthcheck = s.match(check);
            if (depthcheck && depthcheck.length > 0) {
                depth += 1;
                return mergeData(s, d);
            }
            return s;
        }

        this.container.html(this.template);

        // Is it a repeating template?
        let repeater = this.container.find('[bb-repeat=true]');
        if (repeater.length > 0) {
            let templ = repeater[0].outerHTML,
                last = repeater;
            this.data.forEach(function(d) {
                let md = $(mergeData(templ, d));
                last.after(md);
                last = md;
            });
            repeater.remove();
        } else {
            if (this.data.length > 0) {
                this.container.html(mergeData(this.template, this.data[0]));
            } else if (this.template.includes('{{')) {
                this.container.html('');
            }
        }

        return this;
    }
}

export default TemplatePageComponent;
