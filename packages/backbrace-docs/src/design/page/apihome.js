/**
 * @license
 * Copyright Paul Fisher <backbraceio@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

import * as templates from '../modules/templates.js';

backbrace.controller('apihome', (viewer) => {

    let main = viewer.sections.get('main');
    main.template = templates.API_HOME;

    // We need this because of all of the floating elements.
    main.container.css('overflow', 'hidden');

    // Filter and sort the data.
    viewer.beforeUpdate = () => {
        viewer.data = viewer.data.map((value) => { // Add extra fields.
            value.kindInitials = value.kind.substr(0, 1);
            if (value.access)
                value.access = `(${value.access})`;
            return value;
        }).sort((a, b) => { // Sort the data.
            if (a.kind === b.kind)
                return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
            return a.kind > b.kind ? 1 : -1;
        });
    };

});
