import { globals } from '../../globals';
import { promiseblock, promiseeach } from '../../promises';
import { PageComponent } from '../../classes/pagecomponent';
import { ViewerComponent } from '../viewer';

/**
 * @class
 * @extends {PageComponent}
 * @description
 * Generic page component which renders a HTML template.
 */
export class TemplatePageComponent extends PageComponent {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     */
    constructor(viewer) {

        super(viewer);

        /**
         * @description
         * Sub page components.
         * @type {Map<string, ViewerComponent>}
         */
        this.subpages = new Map();
    }

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload() {

        Array.from(this.subpages.values()).forEach((page) => page.unload());
        this.subpages = null;

        super.unload();
    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to load the component.
     */
    load(cont) {

        super.load(cont);

        return promiseblock(
            () => this.loadSections(cont)
        );
    }

    /**
    * @description
    * Load the sections. Sections can be used to show subpages.
    * @param {JQuery} cont Container to load into.
    * @returns {JQueryPromise} Promise to return after we load the sections.
    */
    loadSections(cont) {

        const page = this.viewer.page;

        return promiseeach(page.sections, (section, i) => {

            if (section.pageName !== '') {

                // Create sub page.
                let page = new ViewerComponent(section.pageName, {
                    hasParent: true
                });
                this.subpages.set(section.name, page);
                return page.load(cont);
            }
        });
    }

    /**
     * @description
     * Update the component.
     * @param {*} data Data to load.
     * @returns {JQueryPromise} Promise to return after the component is loaded.
     */
    update(data) {

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
            let templ = repeater[0].outerHTML;
            data.forEach(function(d) {
                repeater.after(mergeData(templ, d));
            });
            repeater.remove();
        } else {
            if (data.length > 0) {
                this.container.html(mergeData(this.template, data[0]));
            } else {
                this.container.html('');
            }
        }

        // Update the sub pages.
        return promiseeach(Array.from(this.subpages.values()), function(page) {
            return page.update();
        });
    }
}

export default TemplatePageComponent;
