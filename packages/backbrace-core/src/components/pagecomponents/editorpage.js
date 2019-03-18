import { get as getAce } from '../../providers/ace';
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
     * @returns {Component} Promise to load the card.
     */
    load() {

        const ace = getAce();
        //TODO - FIX
        //this.viewer.window.main.append('<textarea id="txtEditor" />');
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

        return this;
    }
}

export default EditorPageComponent;
