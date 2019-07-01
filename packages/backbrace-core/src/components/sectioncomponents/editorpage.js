import * as ace from '../../../../../node_modules/brace/index.js';
import * as tern from '../../../../../node_modules/tern/lib/tern.js';
import 'modules/ace/ext-tern';
import 'npm/brace/mode/javascript';
import 'npm/brace/theme/monokai';
import { promiseblock } from '../../promises';
import { get } from '../../http';
import { SectionComponent } from '../sectioncomponent';
import { settings } from '../../settings';

let defs = [];

/**
 * Load a tern definition file.
 * @private
 * @param {string} file File to load.
 * @returns {JQueryPromise} Promises to return after loading the definition file.
 */
function loadDef(file) {
    return promiseblock(
        () => get(`${settings.dir.tern}${file}.json`),
        (def) => defs.push(def)
    );
}

/**
 * @class
 * @extends {SectionComponent}
 * @description
 * Code editor component class.
 */
export class EditorPageComponent extends SectionComponent {

    /**
     * @constructor
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
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(cont) {

        // Load the section component.
        super.load(cont);

        this.window.main.append(`<div id="editor${this.id}" class="editor">`);

        return promiseblock(

            () => loadDef('browser'),
            () => loadDef('ecma5'),
            () => loadDef('jquery'),
            () => loadDef('backbrace'),

            () => {

                let editor = ace.edit(`editor${this.id}`);
                editor.setTheme('ace/theme/monokai');
                editor.session.setMode('ace/mode/javascript');
                ace.acequire('ace/ext/tern');
                editor.setShowPrintMargin(false);
                editor.setOptions({
                    enableTern: {
                        tern: tern,
                        defs: defs,
                        useWorker: false
                    },
                    enableBasicAutocompletion: true,
                    enableSnippets: false,
                    enableLiveAutocompletion: true
                });
            }

        );
    }
}

export default EditorPageComponent;
