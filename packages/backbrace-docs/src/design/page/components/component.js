/**
 * @license
 * Copyright Paul Fisher <paulfisher53@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

import { highlight } from '../../modules/util.js';

backbrace.controller('component', (viewer) => {

    let page = viewer.page,
        apilink = `<div class="alert is-important">
                        <a route="api/${page.caption.replace(/ /g, '')}">Checkout the API for ${page.caption}</a>
                    </div>`;

    viewer.container.css('padding-bottom', '50px');

    viewer.afterUpdate = () => highlight(viewer);

    return backbrace.promiseblock(

        // Get the design on the page.
        () => backbrace.get(`design/page/components/${page.name}.json`),

        (json) => {

            page.sections.forEach((s, i) => {

                // Handle title section.
                if (s.name === 'Title')
                    viewer.sections.get(s.name).template = `<a route="components">Components</a> > <a route="components/${page.name}">${page.name}</a>
                        <h4>${page.caption}</h4>
                        ${apilink}
                        ${s.options.template}`;

                // Add section source.
                if (s.name.indexOf('Source') !== -1 && i > 0) {
                    viewer.sections.get(s.name).template = `<pre style="width: 100%;height: auto;">
                        <code class="json">${JSON.stringify(json.sections[i - 1], null, 2)}</code></pre>`;
                }
            });
        }
    );
});
