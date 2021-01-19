import {
    dom as $,
    clipboard,
    PageService
} from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class DocsService extends PageService {

    async pageLoad() {

        // Highlight code samples.
        $(this.page).find('pre code').each((i, ele) => {

            // Add the copy button.
            let btn = $('<i class="material-icons copy-source clickable" title="Click to copy source">content_copy</i>').prependTo($(ele).parent());
            clipboard(btn[0], ele.innerHTML, () => {
                let notify = $('<div class="notify show">Code copied!</div>').appendTo('body');
                window.setTimeout(() => notify.remove(), 2000);
            });

            // @ts-ignore
            Prism.highlightElement(ele);
        });

    }

}
