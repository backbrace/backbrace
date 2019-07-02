'use strict';

// API Page Controller.
backbrace.controller('api', function(viewer) {

    var $ = backbrace.jquery(),
        editurl = 'https://github.com/backbrace/backbrace/edit/master{0}?message=docs(core)%3A%20describe%20your%20change...{1}',
        sourceurl = 'https://github.com/backbrace/backbrace/tree/master{0}{1}',
        page = viewer.sections.get('main'),
        path = viewer.options.updateHistory || window.location.pathname,
        membertemplate = '<a id="{{name}}"></a><table class="method-table"><thead><tr><th><div>{{name}}' +
            '<a title="Link to this heading" class="heading-link" aria-hidden="true" href="' + path + '#{{name}}' +
            '"><i class="mdi mdi-link"></i></a>' +
            '{{githubLinks}}' +
            '</div></th></tr></thead>' +
            '<tbody>' +
            '<tr {{showDesc}}><td class="desc">{{desc}}</td></tr>' +
            '<tr><td class="sig"><pre class="source">{{signature}}</pre></td></tr>' +
            '<tr {{showParams}}><td class="desc"><h5>Parameters</h5><table style="width:100%">{{paramRows}}</table></td></tr>' +
            '<tr {{showReturns}}><td class="desc"><h5>Returns</h5><br><code>{{returnsType}}</code><br>{{returnsDesc}}</td></tr>' +
            '</table>';

    // Set the page template.
    page.template = '<h1 class="api-heading">{{name}}</h1>' +
        '<label class="api-type {{kind}}">{{access}} {{kind}}&nbsp;</label>' +
        '{{githubLinks}}<section class="desc">{{desc}}</section>' +
        '<div class="api-body">' +
        '{{overview}}' +
        '{{constructors}}' +
        '{{properties}}' +
        '{{methods}}' +
        '</div>';

    function addGithubLinks(file, lineno) {
        return '<a title="View source" class="suggest-link" aria-hidden="true" href="' +
            backbrace.formatString(sourceurl, file, '#L' + lineno) +
            '"><i class="mdi mdi-code-tags"></i></a>' +
            '<a title="Suggest a change" class="suggest-link" aria-hidden="true" href="' +
            backbrace.formatString(editurl, file, '#L' + lineno) +
            '"><i class="mdi mdi-pencil"></i></a>';
    }

    function convertLink(val, links) {
        var vals = val.split('|'),
            ret = [],
            encv = '',
            t = '';
        $.each(vals, function(index, v) {
            encv = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            t = v.replace(/Array\.</g, '').replace(/>/g, '');
            if (links.indexOf(t) === -1) {
                ret.push('<span style="color:blue">' + encv + '</span>');
            } else {
                ret.push('<a style="color:#1abc9c;text-decoration:underline;" route="api/' + t + '">' + encv + '</a>');
            }
        });
        return ret.join('|');
    }

    function mergeData(templ, d) {

        var s = templ,
            check = new RegExp('\\{\\{((.*?))\\}\\}', 'g'),
            fields = s.match(check);
        $.each(fields, function(i, f) {
            var fieldname = f.replace(check, '$1');
            s = s.replace('{{' + fieldname + '}}', d[fieldname] || '');
        });
        return s;
    }

    viewer.onBeforeUpdate = function(data) {

        var modname = viewer.params['module'],
            res = $.grep(data, function(val) {
                return val.name === modname;
            }).map(function(val) {
                val.githubLinks = addGithubLinks(val.file, val.lineno);
                return val;
            }),
            links = $.map(data, function(val) {
                return val.name;
            }),
            d = null;

        if (res.length === 0) {

            backbrace.loadPage('status/404');
            return [];

        } else {

            d = res[0];

            // Set the title.
            viewer.setTitle(d.name);

            return backbrace.promiseblock(
                function() {
                    return backbrace.get('/design/data/members.json');
                },
                function(members) {

                    var constructors = [],
                        properties = [],
                        methods = [],
                        prepend = '';

                    // Transform the members array.
                    members = $.grep(members, function(val) {
                        var isMember = val.memberof === d.name && (val.kind === 'function' || val.kind === 'callback'),
                            isProperty = val.memberof === d.name && (val.kind === 'property' || val.kind === 'member'),
                            isConstruct = val.memberof === d.name && val.kind === 'constructor';
                        return (isMember || isProperty || isConstruct) && !val.ignore;
                    }).map(function(val) {
                        val.sort = 1;
                        if (val.kind === 'property' || val.kind === 'member')
                            val.sort = 2;
                        if (val.kind === 'function' || val.kind === 'callback')
                            val.sort = 3;
                        return val;
                    }).sort(function(a, b) {
                        if (a.sort === b.sort)
                            return a.name > b.name ? 1 : -1;
                        return a.sort > b.sort ? 1 : -1;
                    });

                    d.overview = '';
                    prepend = d.kind === 'module' ? '<span style="color:#9b59b6">' + d.name + '</span>.' : '<span style="color:#9b59b6">this</span>.';

                    if (members.length > 0)
                        $.each(members, function(index, val) {

                            var params = [];

                            // Defaults.
                            val.paramRows = '';
                            val.returns = val.returns || { type: 'void' };
                            val.desc = val.desc || '';

                            if (val.params)
                                $.each(val.params, function(i, p) {
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
                                $.each(val.examples, function(i, ex) {
                                    val.desc += '<pre class="source">' + ex + '</pre>';
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
                                val.signature = prepend + val.name + '(' + params.join(', ') + ') : ' + convertLink(val.returns.type, links);
                                methods.push(mergeData(membertemplate, val));
                            }

                        });

                    d.overview = '<pre class="source"><span style="color:#9b59b6">' + d.kind + '</span> ' +
                        convertLink(d.name, links) + (d.extends ? ' <span style="color:#9b59b6">extends</span> ' +
                            convertLink(d.extends, links) : '') + ' {<br>' +
                        d.overview + '}</pre>';

                    d.constructors = constructors.length > 0 ? '<h4>Constructors</h4>' + constructors.join('<br>') : '';
                    d.properties = properties.length > 0 ? '<h4>Properties</h4>' + properties.join('<br>') : '';
                    d.methods = methods.length > 0 ? '<h4>Methods</h4>' + methods.join('<br>') : '';

                    backbrace.promisequeue(function() {

                        //Process links.
                        $('a[anchor]').each(function() {
                            var a = $(this);
                            a.on('click', function() {
                                $(window).scrollTop($(a.attr('anchor')).position().top - 80);
                            });
                        });

                        if (window.location.hash !== '')
                            $(window).scrollTop($(window.location.hash).position().top - 80);
                    });

                    return [d];
                }
            );

        }
    };

});
