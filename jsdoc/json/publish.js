var fs = require('fs');

/**
 * Publish hook for the JSDoc template.  Writes to JSON stdout.
 * @param {function} data The root of the Taffy DB containing doclet records.
 * @param {Object} opts Options.
 */
exports.publish = function(data, opts, tutorials) {

    var tutes = [];
    function saveChildren(node) {
        node.children.forEach(function(child) {
            tutes.push({
                name: child.name,
                title: child.title,
                html: child.parse(),
                content: child.content,
                parent: node.name,
                type: child.type
            });
            saveChildren(child);
        });
    }
    saveChildren(tutorials);

    var docs = data().get().filter(function(doc) {
        return !doc.undocumented;
    });

    var modules = [];
    var members = [];

    function convertParams(params) {
        var ret = [];
        if (params) {
            for (var p in params)
                ret.push({
                    name: params[p].name,
                    type: params[p].type.names.join('|'),
                    desc: params[p].description,
                    optional: params[p].optional
                });
            return ret;
        }
        return undefined;
    }

    function convertReturns(returns) {
        return returns ? {
            type: returns[0].type.names.join('|'),
            desc: returns[0].description
        } : undefined;
    }

    function addMember(mem) {
        var exists = members.filter(function(m) {
            return m.name === mem.name && m.kind === mem.kind && m.memberof === mem.memberof;
        });
        if (exists.length === 0)
            members.push(mem);
    }

    for (var d in docs) {
        var doc = docs[d];
        if (doc.kind && (doc.kind === 'module' || doc.kind === 'class' || doc.kind === 'typedef')) {
            var exists = modules.filter(function(m) {
                return m.name === doc.name && m.kind === doc.kind;
            });
            if (exists.length === 0)
                modules.push({
                    kind: doc.kind,
                    name: doc.name,
                    desc: doc.description,
                    access: doc.access,
                    extends: doc.augments ? doc.augments[0] : undefined,
                    file: doc.meta ? doc.meta.path.replace(process.cwd(), '') + '/' + doc.meta.filename : '',
                    lineno: doc.meta ? doc.meta.lineno : 0
                });
            if (doc.kind === 'class' && doc.params) {
                addMember({
                    kind: 'constructor',
                    memberof: doc.name,
                    name: doc.name,
                    params: convertParams(doc.params)
                });
            } else if (doc.kind === 'typedef' && doc.params) {
                addMember({
                    kind: 'callback',
                    memberof: doc.name,
                    name: doc.name,
                    params: convertParams(doc.params),
                    returns: convertReturns(doc.returns)
                });
            } else if (doc.kind === 'typedef' && doc.properties) {
                for (var p in doc.properties) {
                    addMember({
                        kind: 'property',
                        type: doc.properties[p].type.names.join('|'),
                        memberof: doc.name,
                        name: doc.properties[p].name,
                        desc: doc.properties[p].description,
                        comment: doc.properties[p].comment,
                        optional: doc.properties[p].optional
                    });
                }
            }
        } else if (doc.memberof && (doc.kind === 'member' || doc.kind === 'function') && !doc.ignore) {
            addMember({
                kind: doc.kind,
                type: doc.type ? doc.type.names.join('|') : undefined,
                memberof: doc.memberof.replace('module:', ''),
                name: doc.name,
                params: convertParams(doc.params),
                returns: convertReturns(doc.returns),
                desc: doc.description,
                async: doc.async,
                examples: doc.examples,
                scope: doc.scope,
                ignore: doc.ignore,
                inherits: doc.inherits,
                file: doc.meta ? doc.meta.path.replace(process.cwd(), '') + '/' + doc.meta.filename : '',
                lineno: doc.meta ? doc.meta.lineno : 0
            });
        }
    }

    // Attach members to modules.
    modules.forEach(function(m) {
        m.members = members.filter((val) => {
            let isMember = val.memberof === m.name && (val.kind === 'function' || val.kind === 'callback'),
                isProperty = val.memberof === m.name && (val.kind === 'property' || val.kind === 'member'),
                isConstruct = val.memberof === m.name && val.kind === 'constructor';
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
    });

    fs.writeFileSync(opts.destination + '/modules.json', JSON.stringify({ modules: modules }, null, 2));
    fs.writeFileSync(opts.destination + '/tutorials.json', JSON.stringify({ tutorials: tutes }, null, 2));
    fs.writeFileSync(opts.destination + '/footer.json', JSON.stringify(tutes.filter(function(t) {
        return t.name === 'footer';
    }), null, 2));

};