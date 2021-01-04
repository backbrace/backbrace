import {
    dom as $,
    Section,
    settings,
    style
} from '../../node_modules/@backbrace/core/dist/Backbrace.js';

import config from '../config.js';
import './apimember.js';

function convertLink(val, links) {

    if (!val)
        return '';

    // Strip jsdoc rubbish.
    val = val.replace(/module:\S*(~|\/)(\S*\.)*/g, '');

    let vals = val.split('|'),
        ret = [],
        encv = '',
        t = '';
    vals.forEach((v) => {
        encv = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        t = v.replace(/Array\.</g, '').replace(/>/g, '');
        if (links.indexOf(t) === -1) {
            ret.push(`<span style="color:blue">${encv}</span>`);
        } else {
            ret.push(`<a style="color:#1abc9c;text-decoration:underline;" bb-route="api/${t}">${encv}</a>`);
        }
    });
    return ret.join('|');
}

function convertParams(params, links) {
    return params.map((p) => p.name + (p.optional ? '?' : '') + ': ' + convertLink(p.type, links)).join(', ');
}

function scrollTo(e) {
    const a = $(e.target),
        t = $(a.attr('anchor'));
    if (t.length > 0)
        window.scroll(0, t.position().top - 80);
}

export default class Api extends Section {

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

    render() {

        if (this.state.hasError)
            return this.html`<bb-error message=${this.state.error.message}></bb-error>`;

        // Generate links.
        let links = this.state.data.map((val) => val.name);

        // Get the module.
        this.state.data = this.state.data.filter((d) => d.name === this.params['module']);

        // Page not found.
        if (this.state.data.length === 0)
            throw this.error('404', `We can't seem to find the page you're looking for.`);

        const api = this.state.data[0],
            title = settings().app.title,
            prepend = api.kind === 'module' ? `<span style="color:#9b59b6">${api.name}</span>.` : '<span style="color:#9b59b6">this</span>.';

        // Set the page title.
        window.document.title = `${title} -  ${api.name}`;

        const properties = [],
            methods = [];

        // Add members.
        api.members.forEach((val) => {

            // Default values.
            val.params = val.params || [];
            val.returns = val.returns || { type: 'void', desc: '' };

            // Copy values.
            let member = {
                name: val.name,
                kind: val.kind,
                signature: null,
                desc: val.desc,
                returns: val.returns,
                returnsType: convertLink(val.returns.type, links),
                returnsDesc: val.returns.desc,
                file: val.file || api.file,
                lineno: val.lineno || api.lineno,
                inherits: (val.inherits ? convertLink(val.inherits.split('#')[0], links) : null)
            };

            // Add examples.
            if (val.examples) {
                member.desc += '<br><h5>Examples</h5>';
                val.examples.forEach((ex) => {
                    member.desc += '<pre class="source example language-javascript"><code>' + ex + '</code></pre>';
                });
            }

            // Add the template.
            if (val.kind === 'property' || val.kind === 'member') {
                member.signature = prepend + val.name + ' : ' + convertLink(val.type, links);
                properties.push(this.html`<docs-apimember member=${JSON.stringify(member)}></docs-apimember>`);
            } else if (val.kind === 'function' || val.kind === 'callback') {
                member.signature = prepend + val.name + '(' + convertParams(val.params, links) + ') : ' + convertLink(val.returns.type, links);
                methods.push(this.html`<docs-apimember member=${JSON.stringify(member)}></docs-apimember>`);
            }

        });

        // Sub templates...

        const header = this.html`
            <h1 class="api-heading">${api.name}</h1>
            <label class="api-type ${api.kind}">${api.access} ${api.kind}&nbsp;</label>
            ${this.addGithubLinks(api.file, api.lineno)}<section class="desc">${api.desc ? this.unsafeHTML(api.desc) : ''}</section>`;

        const overview = this.html`${api.members.map((val) => {
            if (val.kind === 'property' || val.kind === 'member') {
                return this.html`  <a class="ovr-link" anchor=${'#' + val.name} @click=${scrollTo}>${val.name} : ${this.unsafeHTML(convertLink(val.type, links))}</a><br>`;
            } else if (val.kind === 'function' || val.kind === 'callback') {
                // eslint-disable-next-line max-len
                return this.html`  <a class="ovr-link" anchor=${'#' + val.name} @click=${scrollTo}>${val.name}(${this.unsafeHTML(convertParams(val.params, links))}) : ${this.unsafeHTML(convertLink(val.returns.type, links))}</a><br>`;
            }
            return '';
        })}`;

        return this.html`
            ${header}
            <div class="api-body">
            <pre class="source overview"><span style="color:#9b59b6">${api.kind}</span> ${this.unsafeHTML(convertLink(api.name, links))} ${api.extends ?
                this.html`<span style="color:#9b59b6">extends</span> ${this.unsafeHTML(convertLink(api.extends, links))}` : ''} {<br>${overview}}</pre>
                ${properties.length > 0 ? this.html`<h4>Properties</h4>${properties}` : ''}
                ${methods.length > 0 ? this.html`<h4>Methods</h4>${methods}` : ''}
            </div>
        `;
    }

}

Section.define('docs-api', Api);
