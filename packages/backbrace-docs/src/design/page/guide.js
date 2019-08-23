/**
 * @license
 * Copyright Paul Fisher <paulfisher53@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

import { highlight } from '../modules/util.js';
import * as templates from '../modules/templates.js';
import * as settings from '../modules/settings.js';

backbrace.controller('guide', (viewer) => {

    let main = viewer.sections.get('main');
    main.template = templates.GUIDE;

    // Filter the data.
    viewer.events.beforeUpdate = (data) => {

        let name = viewer.params['name'] || 'index',
            p = viewer.params['parent'],
            d = null;

        // Get the guide from the data.
        data = data.filter((val) => val.name.toLowerCase() === name && (!p || p.toLowerCase() === val.parent.toLowerCase()))
            .map((val) => {
                // Add edit icon (markdown pages only).
                if (val.type === 2)
                    val.githublink = `<a title="Suggest a change" class="suggest-link" aria-hidden="true"
                    href="${settings.EDIT_DOCS_URL}/content/${val.parent || val.name}/${val.name}.md?message=docs(core)%3A%20describe%20your%20change...">
                    <i class="mdi mdi-pencil"></i></a>`;
                return val;
            });

        if (data.length === 0) {

            backbrace.routeError('404', 'We can\'t seem to find the page you\'re looking for.');

        } else {

            d = data[0];

            // Set the title.
            viewer.setTitle(name === 'index' ? '' : d.title);

        }

        return data;
    };

    viewer.events.afterUpdate = () => highlight(viewer);

});
