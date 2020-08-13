import { Container } from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class SectionSource extends Container {

    renderContent() {
        const source = JSON.stringify(this.state.data[0], null, 2);
        return this.html`
            <pre class="prettyprint source lang-json"
                style="width: 100%;height: auto;"><code class="language-json">${source}</code></pre>
        `;
    }

}

Container.define('docs-section-source', SectionSource);
