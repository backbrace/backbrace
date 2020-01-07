import * as monaco from '../../../../../node_modules/monaco-editor/esm/vs/editor/editor.api';
import { get } from '../../http';
import { SectionComponent } from '../sectioncomponent';
import { error } from '../../error';
import * as $ from 'jquery';
import { settings } from '../../settings';

const editorError = error('editorpage');

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
         * Editor control.
         * @type {monaco.editor.IStandaloneCodeEditor}
         */
        this.editor = null;

        /**
         * @description
         * Editor mode.
         * @type {string}
         */
        this.type = design.options.type || 'javascript';
    }

    /**
     * @async
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {Promise} Promise to load the card.
     */
    async load(cont) {

        // Load the section component.
        super.load(cont);

        this.window.main.append(`<div id="editor${this.id}" class="editor">`);

        // Add typings (javascript mode).
        if (this.type === 'javascript') {

            // Add jquery types.
            const jqtypes = await get(`${settings.dir.typings}JQuery.d.ts`);
            monaco.languages.typescript.javascriptDefaults.addExtraLib(jqtypes, 'ts:filename/jquery.d.ts');

            // Add backbrace types.
            const types = await get(`${settings.dir.typings}types.d.ts`);
            monaco.languages.typescript.javascriptDefaults.addExtraLib(types, 'ts:filename/types.d.ts');
        }

        // Load the editor.
        this.editor = monaco.editor.create(
            $(`#editor${this.id}`)[0],
            {
                language: this.type,
                theme: 'vs-dark'
            });

        return this;
    }

    /**
     * Show the component.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    show() {
        super.show();
        this.editor.layout();
        return this;
    }

    /**
     * @async
     * @description
     * Update the component.
     * @returns {Promise} Promises to load the editor.
     */
    async update() {

        if (!this.design.options.file)
            return;

        const file = await get(this.design.options.file, 'text');
        if (!file)
            throw editorError('nofile', 'File not found: {0}', this.design.options.file);
        this.editor.setValue(file);
    }
}

export default EditorPageComponent;
