var fs = require('fs');

/**
 * Publish hook for the JSDoc template.  Writes to JSON stdout.
 * @param {function} data The root of the Taffy DB containing doclet records.
 * @param {Object} opts Options.
 */
exports.publish = function(data, opts, tutorials) {

    data({ undocumented: true }).remove();

    var docs = data().get();

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
            if (prop.name === 'icon')
                p.$ref = "icons.json";
            if (p.type.indexOf('Array') === 0) {
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
                generate(root, root.definitions[t], t)
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

    var tableschema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "id": "https://schema.backbrace.io/tabledesign.json",
        "title": "Table design.",
        "type": "object",
        "properties": {
        },
        "definitions": {
        }
    }
    generate(tableschema, tableschema, 'tableDesign')
    fs.writeFileSync(opts.destination + '/tabledesign.json', JSON.stringify(tableschema, null, 2));

    fs.readFile('../node_modules/@mdi/font/css/materialdesignicons.min.css', 'utf8', function(err, data) {
        if (err) throw err;
        var reg = new RegExp(/\.mdi\-?([_a-zA-Z\-]+[\w\-])\:before*\s*\{/gm);
        var matches = data.match(reg);
        var icons = matches.map(function(m) {
            return m.replace(reg, '$1');
        }).filter(function(i) {
            var blacklist = [
                "blank",
                "dark",
                "inactive",
                "light",
                "inactive",
                "spin",
                "flip-h",
                "flip-v"
            ];
            return blacklist.indexOf(i) === -1;
        });
        var iconschema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "id": "https://schema.backbrace.io/icons.json",
            "title": "Material design icons.",
            "type": "string",
            "enum": icons
        };
        fs.writeFileSync(opts.destination + '/icons.json', JSON.stringify(iconschema, null, 2));
    });

};