import { get as getAce } from '../../providers/ace';
import * as packagemanager from '../../packagemanager';
import { PageComponent } from '../../classes/pagecomponent';

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

    }

    /**
     * @description
     * Load the component.
     * @param {JQuery} cont Container to load into.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(cont) {

        packagemanager.add('ace');
        packagemanager.load(() => {

            const ace = getAce();
            this.viewer.window.main.append('<textarea id="txtEditor" />');
            let editor = ace.edit('txtEditor');
            editor.setTheme('ace/theme/monokai');
            editor.session.setMode('ace/mode/javascript');
            ace.require('ace/ext/tern');
            editor.setOptions({
                enableTern: {
                    defs: ['browser', 'ecma5', 'jquery', 'bbtypes', 'backbrace'],
                    useWorker: false
                },
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
        });
    }
}

export default EditorPageComponent;
