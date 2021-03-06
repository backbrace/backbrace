import config from '../config.js';

import {
    dom as $,
    settings,
    Section
} from '../../node_modules/@backbrace/core/dist/Backbrace.js';

export default class Guide extends Section {

    render() {

        if (this.state.hasError)
            return this.html`<bb-error .err=${this.state.error}></bb-error>`;

        this.state.data = this.state.data.filter((d) => d.name === this.params['name']);

        // Page not found.
        if (this.state.data.length === 0)
            throw this.error('404', `We can't seem to find the page you're looking for.`);

        const tutorial = this.state.data[0],
            title = settings().app.title;

        // Set the page title.
        window.document.title = title + (tutorial.name === 'index' ? '' : ' - ' + tutorial.title);

        return this.html`
            <div>
                ${ tutorial.type === 2 ?
                this.html`<a title="Suggest a change" class="suggest-link" aria-hidden="true"
                        href="${config.githubUrl + config.docsPath}/content/${tutorial.parent ? tutorial.parent + '/' : ''}${tutorial.name}.md?message=docs(core)%3A%20describe%20your%20change...">
                            <i class="material-icons">create</i>
                        </a>` :
                ''}
                ${$(tutorial.html)}
            </div>
        `;
    }

}

Section.define('docs-guide', Guide);
