import * as ace from '../../../../../node_modules/brace/index.js';
import * as tern from '../../../../../node_modules/tern/lib/tern.js';
import 'modules/ace/ext-tern';
import 'npm/brace/mode/javascript';
import 'npm/brace/theme/monokai';
import { closePage } from '../../app';
import { promiseblock } from '../../promises';
import { get } from '../../http';
import { PageComponent } from '../../classes/pagecomponent';
import { WindowComponent } from '../window';

let defs = [];

/**
 * Load a tern definition file.
 * @private
 * @param {string} file File to load.
 * @returns {JQueryPromise} Promises to return after loading the definition file.
 */
function loadDef(file) {
    return promiseblock(
        () => get(`json/${file}.json`),
        (def) => defs.push(def)
    );
}

/**
 * @class
 * @extends {PageComponent}
 * @description
 * Code editor component class.
 */
export class EditorPageComponent extends PageComponent {

    /**
     * @constructor
     * @param {ViewerComponent} viewer Viewer component.
     */
    constructor(viewer) {

        super(viewer);

        /**
         * Page window.
         * @type {WindowComponent}
         */
        this.window = null;

    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(cont) {

        const page = this.viewer.page;
        this.window = new WindowComponent({
            icon: page.icon,
            onClose: () => closePage(this.viewer.id)
        });

        this.window
            .load(cont)
            .setTitle(page.caption)
            .main.append('<textarea id="txtEditor" />');

        return promiseblock(

            () => loadDef('browser'),
            () => loadDef('ecma5'),
            () => loadDef('jquery'),
            () => loadDef('backbrace'),

            () => {

                let editor = ace.edit('txtEditor');
                editor.setTheme('ace/theme/monokai');
                editor.session.setMode('ace/mode/javascript');
                ace.acequire('ace/ext/tern');
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

    /**
     * @description
     * Show the card component.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    show() {
        this.window.show();
        return this;
    }

    /**
     * @description
     * Hide the card component.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    hide() {
        this.window.hide();
        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    showLoad() {
        super.showLoad();
        this.window.loader.show();
        return this;
    }

    /**
     * @description
     * Show the loader.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    hideLoad() {
        super.hideLoad();
        this.window.loader.hide();
        return this;
    }

    /**
     * Hide the preloader.
     * @returns {EditorPageComponent} Returns itself for chaining.
     */
    hidePreLoad() {
        this.window.preloader.hide();
        return this;
    }
}

export default EditorPageComponent;
