var fs = require('fs');

/**
 * Publish hook for the JSDoc template.  Writes to JSON stdout.
 * @param {function} data The root of the Taffy DB containing doclet records.
 * @param {Object} opts Options.
 */
exports.publish = function(data, opts, tutorials) {

    data({ undocumented: true }).remove();

    var docs = data().get();

    var reftypes = [
        'sectionOptions', 'appConfig', 'dirConfig', 'styleConfig', 'pageSectionDesign',
        'imagesConfig', 'colorsConfig', 'routeConfig', 'queryDesign', 'storeMapping', 'headConfig'];

    function getType(docs_, name_) {
        for (var d in docs_) {
            if (docs_[d].name && docs_[d].name === name_)
                return docs_[d];
        }
        return null;
    }

    function convertDescription(desc) {
        if (desc)
            desc = desc.replace(/\<p\>/g, '').replace(/\<\/p\>/g, '');
        return desc;
    }

    function generate(root, schema, name) {
        var ty = getType(docs, name);
        if (!ty)
            return;
        ty.properties.forEach(function(prop) {

            var p = {
                "description": convertDescription(prop.description),
                "type": prop.type.names.join('|')
            }, t = null;

            if (p.type === 'Object') p.type = 'object';

            if (prop.name === 'icon') {

                p.$ref = "icons.json";

            } else if (reftypes.indexOf(p.type) !== -1) {

                p.$ref = "#/definitions/" + p.type;
                root.definitions[p.type] = {
                    "description": p.type + " Object",
                    "type": "object",
                    "properties": {
                    }
                }
                generate(root, root.definitions[p.type], p.type);
                delete p.type;

            } else if (p.type.indexOf('Array') === 0) {

                t = p.type.replace(/Array\.\</g, '').replace(/\>/g, '');
                p.type = "array";
                p.items = {
                    "$ref": "#/definitions/" + t
                }
                root.definitions[t] = {
                    "description": t + " Object",
                    "type": "object",
                    "properties": {
                    }
                }
                generate(root, root.definitions[t], t);
            }
            schema.properties[prop.name] = p;
        });
    }

    var pageschema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "https://schema.backbrace.io/pagedesign.json",
        "title": "Page design.",
        "type": "object",
        "properties": {
        },
        "definitions": {
        }
    }
    generate(pageschema, pageschema, 'pageDesign')
    fs.writeFileSync(opts.destination + '/pagedesign.json', JSON.stringify(pageschema, null, 2));

    var settingsschema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "https://schema.backbrace.io/settings.json",
        "title": "Application Settings.",
        "type": "object",
        "properties": {
        },
        "definitions": {
        }
    }
    generate(settingsschema, settingsschema, 'settingsConfig')
    fs.writeFileSync(opts.destination + '/settings.json', JSON.stringify(settingsschema, null, 2));

};