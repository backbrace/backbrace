var fs = require('fs');
var helper = require("jsdoc/util/templateHelper");

/**
 * Publish hook for the JSDoc template.  Writes to JSON stdout.
 * @param {function} data The root of the Taffy DB containing doclet records.
 * @param {Object} opts Options.
 */
exports.publish = function(data, opts, tutorials) {

    data({ undocumented: true }).remove();

    var docs = data().get();

    const pkg = (helper.find(data, { kind: 'package' }) || [])[0];

    var output = {
        "!name": pkg.name,
        "!define": {
        }
    };

    var library = {};

    function convertType(type) {
        if (type) {
            //pipes
            if (type.indexOf('|') !== -1) {
                type = '?';
            }
            //arrays
            if (type.indexOf('Array.<') !== -1) {
                type = type.replace(/Array\.\</g, '[').replace(/\>/g, ']');
            }
            //arraylike
            if (type.indexOf('ArrayLike.<') !== -1) {
                type = '?';
            }
            //jquery
            if (type === 'JQuery' || type === 'JQueryStatic') {
                type = 'jQuery.fn';
            }
            //jquerypromise
            if (type.indexOf('JQueryPromise.<') !== -1 || type === 'JQueryPromise') {
                type = '+jQuery.Promise';
            }
            //any
            if (type === '*' || type === 'any') {
                type = type.replace(/\*/g, '?');
            }
            //functions
            if (type.indexOf('function') !== -1) {
                type = type.replace(/function/g, 'fn()');
            }
            if ((output[type] && output[type].prototype) || /[A-Z]/.test(type[0])) {
                type = '+' + type;
            }
        }
        return type;
    }

    function convertDescription(desc) {
        if (desc)
            desc = desc.replace(/\<p\>/g, '').replace(/\<\/p\>/g, '');
        return desc;
    }

    function convertParams(params) {
        var ret = [];
        if (params) {
            for (var p in params)
                ret.push(params[p].name + (params[p].optional ? '?' : '') + ': ' + convertType(params[p].type.names.join('|')));
            return 'fn(' + ret.join(', ') + ')';
        }
        return 'fn()';
    }

    function convertReturns(returns) {
        if (returns && returns[0].type.names.join('|') === 'void')
            return '';
        return returns ? ' -> ' + convertType(returns[0].type.names.join('|')) : '';
    }

    for (var d in docs) {
        var doc = docs[d];
        if (doc.kind && (doc.kind === 'module' || doc.kind === 'class' || doc.kind === 'typedef')) {

            if (doc.kind === 'class') {

                var obj = {
                    "!type": "fn()",
                    "prototype": {
                    },
                    "!doc": convertDescription(doc.description)
                };
                output[doc.name] = obj;

            } else if (doc.kind === 'typedef' && doc.properties) {

                var obj = {};
                for (var p in doc.properties) {
                    var dp = doc.properties[p];
                    obj[dp.name] = convertType(dp.type.names.join('|'));
                }
                output['!define'][doc.name] = obj;

            } else if (doc.kind === 'typedef' && doc.params) {

                output[doc.name] = {
                    "!type": convertParams(doc.params) + convertReturns(doc.returns),
                    "!doc": convertDescription(doc.description)
                };

            }

        } else if (doc.memberof && (doc.kind === 'member' || doc.kind === 'function')) {

            var name = doc.memberof.replace('module:', '');
            if (name === pkg.name) {
                library[doc.name] = {
                    "!type": convertParams(doc.params) + convertReturns(doc.returns),
                    "!doc": convertDescription(doc.description)
                };
            } else if (output[name] && output[name].prototype) {
                output[name].prototype[doc.name] = {
                    "!type": doc.kind === 'function' ? convertParams(doc.params) + convertReturns(doc.returns) : convertType(doc.type.names.join('|')),
                    "!doc": convertDescription(doc.description)
                };
            }
        }
    }

    output[pkg.name] = library;

    fs.writeFileSync(opts.destination + '/' + pkg.name + '.json', JSON.stringify(output, null, 2));

};