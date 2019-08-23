/**
 * @license
 * Copyright Paul Fisher <paulfisher53@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

const $ = backbrace.jquery();

/**
 * Highlight syntax in code samples.
 * @param {ViewerComponent} viewer Viewer component.
 * @returns {void}
 */
export function highlight(viewer) {

    // Loop code examples.
    viewer.container.find('pre code').each((i, ele) => {

        // Add the copy button.
        let btn = $('<i class="mdi mdi-content-copy copy-source" title="Click to copy source"></i>').prependTo($(ele).parent()),
            clipboard = backbrace.clipboard(btn[0], ele.innerHTML);
        clipboard.on('success', () => {
            let notify = $('<div class="notify show">Code copied!</div>').appendTo('body');
            window.setTimeout(() => notify.remove(), 2000);
        });

        // Syntax highlighting.
        backbrace.highlightSyntax(ele);
    });
}

/**
 * Merge data with a template.
 * @param {string} templ Template.
 * @param {*} d Data to merge.
 * @returns {string} Returns the merged string.
 */
export function mergeData(templ, d) {
    let s = templ,
        check = new RegExp('\\{\\{((.*?))\\}\\}', 'g'),
        fields = s.match(check);
    fields.forEach((f) => {
        let fieldname = f.replace(check, '$1');
        s = s.replace(`{{${fieldname}}}`, d[fieldname] || '');
    });
    return s;
}

/**
 * Convert a document link.
 * @param {string} val String value.
 * @param {string[]} links Document links.
 * @returns {string} Return the converted document link.
 */
export function convertLink(val, links) {
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
            ret.push(`<a style="color:#1abc9c;text-decoration:underline;" route="api/${t}">${encv}</a>`);
        }
    });
    return ret.join('|');
}
