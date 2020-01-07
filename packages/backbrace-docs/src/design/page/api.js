/**
 * @license
 * Copyright Paul Fisher <backbraceio@gmail.com> All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://backbrace.io/mitlicense
 */

import { highlight, mergeData, convertLink } from '../modules/util.js';
import * as templates from '../modules/templates.js';
import * as settings from '../modules/settings.js';

/**
 * Add API github links.
 * @param {string} file File path.
 * @param {number} lineno Line number.
 * @returns {string} Returns the github API link.
 */
function addGithubLinks(file, lineno) {
    return `<a title="View source" class="suggest-link" aria-hidden="true" href="${settings.MASTER_TREE}${file}#L${lineno}">
        <i class="mdi mdi-code-tags"></i></a>
        <a title="Suggest a change" class="suggest-link" aria-hidden="true" href="${settings.EDIT_MASTER}${file}?message=docs(core)%3A%20describe%20your%20change...#L${lineno}">
        <i class="mdi mdi-pencil"></i></a>`;
}

backbrace.controller('api', (viewer) => {

    let $ = backbrace.jquery(),
        page = viewer.sections.get('main'),
        membertemplate = templates.API_MEMBER;

    // Set the page template.
    page.template = templates.API;

    viewer.beforeUpdate = async function() {

        let modname = viewer.params['module'],
            res = viewer.data.filter((val) => val.name === modname)
                .map((val) => {
                    val.githubLinks = addGithubLinks(val.file, val.lineno);
                    return val;
                }),
            links = viewer.data.map((val) => val.name),
            d = null;

        if (res.length === 0) {

            backbrace.routeError('404', 'We can\'t seem to find the page you\'re looking for.');

        } else {

            d = res[0];

            // Set the title.
            viewer.setTitle(d.name);

            // Get the member data.
            let members = await backbrace.get('/design/data/members.json');

            let constructors = [],
                properties = [],
                methods = [],
                prepend = '';

            // Transform the members array.
            members = members.filter((val) => {
                let isMember = val.memberof === d.name && (val.kind === 'function' || val.kind === 'callback'),
                    isProperty = val.memberof === d.name && (val.kind === 'property' || val.kind === 'member'),
                    isConstruct = val.memberof === d.name && val.kind === 'constructor';
                return (isMember || isProperty || isConstruct) && !val.ignore;
            }).map((val) => {
                val.sort = 1;
                if (val.kind === 'property' || val.kind === 'member')
                    val.sort = 2;
                if (val.kind === 'function' || val.kind === 'callback')
                    val.sort = 3;
                return val;
            }).sort((a, b) => {
                if (a.sort === b.sort)
                    return a.name > b.name ? 1 : -1;
                return a.sort > b.sort ? 1 : -1;
            });

            d.overview = '';
            prepend = d.kind === 'module' ? `<span style="color:#9b59b6">${d.name}</span>.` : '<span style="color:#9b59b6">this</span>.';

            if (members.length > 0)
                members.forEach((val) => {

                    let params = [];

                    // Defaults.
                    val.paramRows = '';
                    val.returns = val.returns || { type: 'void' };
                    val.desc = val.desc || '';
                    val.browserPath = viewer.options.updateHistory || window.location.pathname;

                    if (val.params)
                        val.params.forEach((p) => {
                            if (p.name === 'args')
                                p.name = '...' + p.name;
                            params.push(p.name + (p.optional ? '?' : '') + ': ' + convertLink(p.type, links));
                            val.paramRows += '<tr><td style="width:20%;font-weight:700;padding:16px 16px 0 0"><code>' + p.name + '</code></td>' +
                                '<td><code>' + convertLink(p.type, links) + '</code></td>' +
                                '<td style="padding-left: 20px;font-size:12px;">' +
                                (p.desc ? '<p>' + (p.optional ? 'Optional. ' : '') + p.desc.substr(3) : '') + '</td></tr>';
                        });

                    if (val.inherits)
                        val.desc += '<br><p>Inherited from ' + convertLink(val.inherits.split('#')[0], links) + '</p>';

                    if (val.examples) {
                        val.desc += '<br><h5>Examples</h5>';
                        val.examples.forEach((ex) => {
                            val.desc += '<pre class="source example"><code class="javascript">' + ex + '</code></pre>';
                        });
                    }

                    val.githubLinks = addGithubLinks(val.file || d.file, val.lineno || d.lineno);
                    val.returnsType = convertLink(val.returns.type, links);
                    val.returnsDesc = val.returns.desc;

                    val.showDesc = val.desc !== '' ? '' : 'style="display:none"';
                    val.showParams = val.paramRows !== '' ? '' : 'style="display:none"';
                    val.showReturns = val.kind === 'function' || val.kind === 'callback' ? '' : 'style="display:none"';

                    if (val.kind === 'property' || val.kind === 'member') {

                        d.overview += '  <a class="ovr-link" anchor="#' + val.name + '">' + val.name +
                            ' : ' + convertLink(val.type, links) + '</a><br>';
                        val.signature = prepend + val.name + ' : ' + convertLink(val.type, links);
                        properties.push(mergeData(membertemplate, val));

                    } else if (val.kind === 'constructor') {

                        d.overview += '  constructor(' + params.join(', ') + ')<br>';
                        val.name = 'constructor';
                        val.signature = val.name + '(' + params.join(', ') + ')';
                        constructors.push(mergeData(membertemplate, val));

                    } else if (val.kind === 'function' || val.kind === 'callback') {

                        d.overview += '  <a class="ovr-link" anchor="#' + val.name + '">' + val.name +
                            '(' + params.join(', ') + ') : ' + convertLink(val.returns.type, links) + '</a><br>';
                        val.signature = (val.async ? '<span style="color:blue">async</span> ' : '') + prepend + val.name + '(' + params.join(', ') + ') : ' + convertLink(val.returns.type, links);
                        methods.push(mergeData(membertemplate, val));
                    }

                });

            d.overview = '<pre class="source overview"><span style="color:#9b59b6">' + d.kind + '</span> ' +
                convertLink(d.name, links) + (d.extends ? ' <span style="color:#9b59b6">extends</span> ' +
                    convertLink(d.extends, links) : '') + ' {<br>' +
                d.overview + '}</pre>';

            d.constructors = constructors.length > 0 ? '<h4>Constructors</h4>' + constructors.join('<br>') : '';
            d.properties = properties.length > 0 ? '<h4>Properties</h4>' + properties.join('<br>') : '';
            d.methods = methods.length > 0 ? '<h4>Methods</h4>' + methods.join('<br>') : '';

            // backbrace.promisequeue(() => {

            //     //Process links.
            //     $('a[anchor]').each((i, ele) => {
            //         let a = $(ele);
            //         a.on('click', () => $(window).scrollTop($(a.attr('anchor')).position().top - 80));
            //     });

            //     if (window.location.hash !== '')
            //         $(window).scrollTop($(window.location.hash).position().top - 80);
            // });

            viewer.data = [d];

        }
    };

    viewer.afterUpdate = () => highlight(viewer);

});
