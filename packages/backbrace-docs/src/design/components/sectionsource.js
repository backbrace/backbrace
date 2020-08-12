import { Container, clipboard, dom as $ } from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class SectionSource extends Container {

    updated() {

        // Highlight code samples.
        $(this).find('pre code').each((i, ele) => {

            // Add the copy button.
            let btn = $('<img src="../../node_modules/@backbrace/core/dist/mdi/content-copy.svg" class="copy-source clickable" title="Click to copy source"></img>').prependTo($(ele).parent());
            clipboard(btn[0], ele.innerHTML, () => {
                let notify = $('<div class="notify show">Code copied!</div>').appendTo('body');
                window.setTimeout(() => notify.remove(), 2000);
            });

            // @ts-ignore
            Prism.highlightElement(ele);
        });

    }

    renderContent() {
        const source = JSON.stringify(this.state.data[0], null, 2);
        return this.html`
            <pre class="prettyprint source lang-json"
                style="width: 100%;height: auto;"><code class="language-json">${source}</code></pre>
        `;
    }

}

Container.define('docs-section-source', SectionSource);
