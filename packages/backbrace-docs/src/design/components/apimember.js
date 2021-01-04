import { Component, style, dom as $ } from '../../node_modules/@backbrace/core/dist/Backbrace.js';
import config from '../config.js';

export default class ApiMember extends Component {

    constructor() {
        super();
        this.member = null;
    }

    addGithubLinks(file, lineno) {
        const md = style();
        return this.html`
        <a aria-hidden="true" href="${config.githubUrl}/tree/master${file}#L${lineno}">
            ${$(md.icon('code')).addClass('suggest-link').attr({ 'title': 'View source', 'width': '20px' })}
        </a>
        <a aria-hidden="true" href="${config.githubUrl}/edit/master${file}?message=docs(core)%3A%20describe%20your%20change...#L${lineno}">
            ${$(md.icon('create')).addClass('suggest-link').attr({ 'title': 'Suggest a change', 'width': '20px' })}
        </a>`;
    }

    updated() {

        // Scroll to this member?
        if (window.location.hash === '#' + this.member.name) {
            const t = $('#' + this.member.name);
            if (t.length > 0) {
                window.setTimeout(() => window.scroll(0, t.position().top - 80), 100);
            }
        }

        // Highlight code samples.
        $(this).find('pre code').each((i, ele) => {
            // @ts-ignore
            Prism.highlightElement(ele);
        });
    }

    render() {

        const val = this.member,
            md = style();

        return this.html`
            <a id=${val.name}></a>
            <table class="method-table z-depth-1">
                <thead>
                    <tr>
                        <th>
                            <div>
                            ${val.name}
                            <a aria-hidden="true" href="${window.location.pathname}#${val.name}">
                                ${$(md.icon('link')).addClass('heading-link').attr({ 'title': 'Link to this heading', 'width': '20px' })}
                            </a>
                            ${this.addGithubLinks(val.file, val.lineno)}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${val.desc ? this.html`
                    <tr>
                        <td class="desc">
                            ${this.unsafeHTML(val.desc)}
                            ${val.inherits ? this.html`<br><p>Inherited from ${this.unsafeHTML(val.inherits)}</p>` : ''}
                        </td>
                    </tr>` : ''}
                    <tr>
                        <td class="sig">
                            <pre class="source overview">${this.unsafeHTML(val.signature)}</pre>
                        </td>
                    </tr>
                    ${val.paramRows ? this.html`
                    <tr>
                        <td class="desc">
                            <h5>Parameters</h5>
                            <table style="width:100%">${this.unsafeHTML(val.paramRows)}</table>
                        </td>
                    </tr>` : ''}
                    ${val.kind === 'function' || val.kind === 'callback' ? this.html`
                    <tr>
                        <td class="desc">
                            <h5>Returns</h5>
                            <code>${this.unsafeHTML(val.returnsType)}</code><br>
                            ${val.returnsDesc ? this.unsafeHTML(val.returnsDesc) : ''}
                        </td>
                    </tr>` : ''}
                </tbody >
            </table > <br>`;
    }

}

Component.define('docs-apimember', ApiMember);
