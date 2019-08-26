import * as ace from '../../../../../node_modules/brace/index.js';
import * as tern from '../../../../../node_modules/tern/lib/tern.js';
import 'modules/ace/ext-tern';
import 'npm/brace/theme/monokai';
import 'npm/brace/mode/javascript';
import 'npm/brace/mode/json';
import { promiseblock } from '../../promises';
import { get } from '../../http';
import { SectionComponent } from '../sectioncomponent';
import { settings } from '../../settings';
import { error } from '../../error';

const editorError = error('editorpage');

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
 * @class EditorPageComponent
 * @extends {SectionComponent}
 * @description
 * Code editor component class.
 */
export class EditorPageComponent extends SectionComponent {

    /**
     * @constructs EditorPageComponent
     * @param {ViewerComponent} viewer Viewer component.
     * @param {pageSectionDesign} design Section design.
     */
    constructor(viewer, design) {
        super(viewer, design);

        /**
         * @description
         * Ace editor control.
         * @type {ace.Editor}
         */
        this.editor = null;

        /**
         * @description
         * Ace mode.
         * @type {string}
         */
        this.type = (design.options.type || 'javascript');
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

            () => {
                if (this.type === 'javascript')
                    return promiseblock(
                        () => loadDef('browser'),
                        () => loadDef('ecma5'),
                        () => loadDef('jquery'),
                        () => loadDef('backbrace')
                    );
            },

            () => {

                this.editor = ace.edit(`editor${this.id}`);
                this.editor.setTheme('ace/theme/monokai');
                this.editor.session.setMode(`ace/mode/${this.type}`);
                ace.acequire('ace/ext/tern');
                this.editor.setShowPrintMargin(false);
                this.editor.setOptions({
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

    /**
     * @description
     * Update the component.
     * @returns {JQueryPromise} Promises to load the editor.
     */
    update() {
        if (!this.design.options.file)
            return;
        return promiseblock(
            () => get(this.design.options.file, 'text'),
            (file) => {
                if (!file)
                    throw editorError('nofile', 'File not found: {0}', this.design.options.file);
                this.editor.setValue(file, -1);
            }
        );
    }
}

export default EditorPageComponent;
