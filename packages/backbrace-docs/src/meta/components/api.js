'use strict';

backbrace.pageComponent('components/api.js', function(comp) {

    var $ = backbrace.jquery(),
        editurl = 'https://github.com/backbrace/backbrace/edit/master{0}?message=docs(core)%3A%20describe%20your%20change...{1}',
        sourceurl = 'https://github.com/backbrace/backbrace/tree/master{0}{1}',
        path = comp.viewer.options.updateHistory || window.location.pathname;

    comp.update = function(data) {

        var modname = comp.viewer.params['module'],
            res = $.grep(data, function(val) {
                return val.name === modname;
            }),
            links = $.map(data, function(val) {
                return val.name;
            }),
            d = null;

        function addGithubLinks(file, lineno) {
            return '<a title="View source" class="suggest-link" aria-hidden="true" href="' +
                backbrace.formatString(sourceurl, file, '#L' + lineno) +
                '"><i class="mdi mdi-code-tags"></i></a>' +
                '<a title="Suggest a change" class="suggest-link" aria-hidden="true" href="' +
                backbrace.formatString(editurl, file, '#L' + lineno) +
                '"><i class="mdi mdi-pencil"></i></a>';
        }

        if (res.length === 0) {

            backbrace.loadPage('status/404');

        } else {

            d = res[0];

            this.viewer.setTitle(d.name);

            this.container.html('<h1 class="api-heading">' + d.name + '</h1>' +
                addGithubLinks(d.file, d.lineno) +
                '<label class="api-type ' + d.kind + '">' + d.kind + '</label>' +
                '<section class="desc">' + (d.desc || '') + '</section>' +
                '<div class="api-body">' +
                '</div>');

            return backbrace.promiseblock(
                function() {
                    return backbrace.get('/meta/data/members.json');
                },
                function(members) {

                    var methods = $.grep(members, function(val) {
                        return val.memberof === d.name && (val.kind === 'function' || val.kind === 'callback');
                    }),
                        props = $.grep(members, function(val) {
                            return val.memberof === d.name && (val.kind === 'property' || val.kind === 'member');
                        }),
                        construct = $.grep(members, function(val) {
                            return val.memberof === d.name && val.kind === 'constructor';
                        }),
                        abody = $('.api-body'),
                        overview = '',
                        callback = methods.length > 0 && methods[0].kind === 'callback';

                    function sortMembers(a, b) {
                        if (a.name < b.name)
                            return -1;
                        return 1;
                    }

                    function convertLink(val) {
                        var vals = val.split('|'),
                            ret = [],
                            encv = '';
                        $.each(vals, function(index, v) {
                            encv = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            if (links.indexOf(v) === -1) {
                                ret.push(encv);
                            } else {
                                ret.push('<a style="color:blue" route="api/' + v + '">' + encv + '</a>');
                            }
                        });
                        return ret.join('|');
                    }

                    function addMember(val) {

                        var params = [],
                            prows = [];

                        // Parse parameters.
                        if (val.params)
                            $.each(val.params, function(i, p) {
                                if (p.name === 'args')
                                    p.name = '...' + p.name;
                                params.push(p.name + (p.optional ? '?' : '') + ': ' + convertLink(p.type));
                                prows.push('<tr><td style="width:20%;font-weight:700;padding:16px 16px 0 0"><code>' + p.name + '</code></td>' +
                                    '<td><code>' + convertLink(p.type) + '</code></td>' +
                                    '<td style="padding-left: 20px;font-size:12px;">' +
                                    (p.desc ? '<p>' + (p.optional ? 'Optional. ' : '') + p.desc.substr(3) : '') + '</td></tr>');
                            });

                        // Property overview.
                        if (val.kind === 'property' || val.kind === 'member') {
                            overview += '  <a class="ovr-link" anchor="#' + val.name + '">' + val.name +
                                ' : ' + convertLink(val.type) + '</a><br>';
                        } else if (val.kind === 'constructor') { // Constructor overview.
                            overview += '  constructor(' + params.join(', ') + ')<br>';
                            val.name = 'constructor';
                        } else if (val.kind === 'function' || val.kind === 'callback') {
                            val.returns = val.returns || { type: 'void' };
                            overview += '  <a class="ovr-link" anchor="#' + val.name + '">' + val.name +
                                '(' + params.join(', ') + ') : ' + convertLink(val.returns.type) + '</a><br>';
                        }

                        abody.append(
                            // Add heading.
                            '<a id="' + val.name + '"></a><table class="method-table"><thead><tr><th><div>' + val.name +
                            // Add heading link.
                            '<a title="Link to this heading" class="heading-link" aria-hidden="true" href="' + path + '#' + val.name +
                            '"><i class="mdi mdi-link"></i></a>' +
                            addGithubLinks(val.file || d.file, val.lineno || d.lineno) +
                            '</div></th></tr></thead>' +
                            '<tbody>' +
                            // Add description.
                            (val.desc ? '<tr><td class="desc">' + val.desc + '</td></tr>' : '') +
                            // Add property signature.
                            (val.kind === 'property' || val.kind === 'member' ?
                                '<tr><td class="sig"><pre class="source">' + val.name + ' : ' + convertLink(val.type) + '</pre></td></tr>' : '') +
                            // Add constructor signature.
                            (val.kind === 'constructor' ?
                                '<tr><td class="sig"><pre class="source"> ' + val.name + '(' + params.join(', ') + ')</pre></td></tr>' : '') +
                            // Add method signature.
                            (val.kind === 'function' || val.kind === 'callback' ?
                                '<tr><td class="sig"><pre class="source">' + val.name + '(' + params.join(', ') + ') : ' +
                                convertLink(val.returns.type) + '</pre></td></tr>' : '') +
                            // Add parameters.
                            (prows.length > 0 ? '<tr><td class="desc"><h5>Parameters</h5>' +
                                '<table style="width:100%">' + prows.join('') + '</table>' +
                                '</td></tr>' : '') +
                            // Add returns.
                            (val.returns ?
                                '<tr><td class="desc"><h5>Returns</h5><br><code>' +
                                convertLink(val.returns.type) + '</code>' + (val.returns.desc || '') + '</td></tr>' : '') +
                            '</table>');
                    }

                    if (construct.length > 0) {
                        abody.append('<h4>Constructors</h4>');
                        construct = construct.sort(sortMembers);
                        $.each(construct, function(index, val) {
                            addMember(val);
                        });
                    }

                    if (props.length > 0) {
                        abody.append('<h4>Properties</h4>');
                        props = props.sort(sortMembers);
                        $.each(props, function(index, val) {
                            addMember(val);
                        });
                    }

                    if (methods.length > 0) {
                        if (!callback) {
                            abody.append('<h4>Methods</h4>');
                            methods = methods.sort(sortMembers);
                        }
                        $.each(methods, function(index, val) {
                            addMember(val);
                        });
                    }

                    if (overview !== '' && !callback) {
                        overview = d.kind + ' ' + d.name + (d.extends ? ' extends ' + convertLink(d.extends) : '') + ' {<br>' +
                            overview +
                            '}';
                        $('<pre class="source">' + overview + '</pre>').prependTo(abody);
                    }

                    //Process links.
                    $('a[anchor]').each(function() {
                        var a = $(this);
                        a.on('click', function() {
                            $(window).scrollTop($(a.attr('anchor')).position().top - 80);
                        });
                    });

                    if (window.location.hash !== '')
                        $(window).scrollTop($(window.location.hash).position().top - 80);
                }
            );
        }
    };
    return comp;
});
