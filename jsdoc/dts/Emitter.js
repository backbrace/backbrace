"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom = require("dts-dom");
const fs = require("fs");
const path = require("path");
const logger_1 = require("./logger");
const rgxArrayType = /^Array(?:\.<(.*)>)?$/;
const rgxObjectType = /^Object\.<(\w*),\s*\(?(.*)\)?>$/;
const rgxMapType = /^Map\.<(\w*),\s*\(?(.*)\)?>$/;
const rgxJsDocHeader = /^\/\*\*\s?/;
const rgxJsDocFooter = /\s*\*\/\s?$/;
const rgxJsDocBody = /^\*\s?/;
const RAW_GLOBAL_TYPES = JSON.parse(fs.readFileSync(path.join(__dirname, 'global-types.json')).toString());
const GLOBAL_TYPES = Object.keys(RAW_GLOBAL_TYPES)
    .reduce((acc, key) => {
        RAW_GLOBAL_TYPES[key].forEach((t) => {
            acc[t] = dom.create.namedTypeReference(t);
        });
        return acc;
    }, {});
const accessFlagMap = {
    public: dom.DeclarationFlags.None,
    private: dom.DeclarationFlags.Private,
    protected: dom.DeclarationFlags.Protected,
};
const moduleCheck = new RegExp(/module:(\S+\/\S+\.|\S+~|\S+\.)/gm);
class Emitter {
    constructor(docs, config, eol = '\n') {
        this.config = config;
        this.eol = eol;
        this.parse(docs);
    }
    parse(docs) {
        this.results = [];
        this.objects = Object.assign({}, GLOBAL_TYPES);
        if (!docs) {
            return;
        }
        this._parseObjects(docs);
        this._resolveObjects(docs);
        this._resolveInterfaceMembers(docs);
        this._resolveModules(this.results);
    }
    emit() {
        dom.config.outputEol = this.eol;
        let out = '';
        for (const res of this.results) {
            out += dom.emit(res);
        }
        return out;
    }
    _parseObjects(docs) {
        for (const doclet of docs) {
            if (!this._shouldResolveDoclet(doclet)) {
                continue;
            }
            if (this.objects[doclet.longname] && !doclet.override) {
                continue;
            }
            switch (doclet.kind) {
                case 'class':
                    this._createClass(doclet);
                    break;
                case 'constant':
                    this._createMember(doclet);
                    break;
                case 'function':
                    this._createFunction(doclet);
                    break;
                case 'interface':
                    this._createInterface(doclet);
                    break;
                case 'member':
                    this._createMember(doclet);
                    break;
                case 'mixin':
                    this._createInterface(doclet);
                    break;
                case 'module':
                    this._createNamespace(doclet);
                    break;
                case 'namespace':
                    this._createNamespace(doclet);
                    break;
                case 'typedef':
                    this._createTypedef(doclet);
                    break;
            }
            const obj = this.objects[doclet.longname];
            if (!obj) {
                continue;
            }
            obj.jsDocComment = cleanComment(doclet.comment);
            handleCustomTags(doclet, obj);
            if (!doclet.memberof) {
                this.results.push(obj);
            }
        }
    }
    _resolveObjects(docs) {
        for (const doclet of docs) {
            if (!this._shouldResolveDoclet(doclet)) {
                continue;
            }
            const obj = this.objects[doclet.longname];
            if (!obj) {
                logger_1.warnResolve(doclet, 1);
                continue;
            }
            if (doclet.memberof && !doclet.inherited) {
                const objMember = obj;
                const p = this.objects[doclet.memberof];
                if (!p) {
                    logger_1.warnResolve(doclet, 0, 'No such name found.');
                }
                else if (!p.members) {
                    logger_1.warnResolve(doclet, 0, `Found parent, but it cannot contain members. Discovered type: ${p.kind}.`);
                }
                else {
                    if (objMember.kind === 'function' && p.kind !== 'namespace') {
                        objMember.kind = 'method';
                    }
                    let isDuplicate = false;
                    for (const member of p.members) {
                        if (member._doclet.longname === objMember._doclet.longname) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (isDuplicate) {
                        continue;
                    }
                    obj._parent = p;
                    p.members.push(objMember);
                }
            }
            if (doclet.kind === 'typedef' && obj.type) {
                obj.type._parent = obj;
            }
            if (doclet.kind === 'function'
                || (doclet.kind === 'typedef' && obj.type && obj.type.kind === 'function-type')) {
                const d = doclet;
                const o = (doclet.kind === 'typedef' ? obj.type : obj);
                if (doclet.params) {
                    o.parameters = this._resolveFunctionParams(doclet.params);
                }
                for (const param of o.parameters) {
                    param._parent = o;
                }
                if (!d.returns) {
                    o.returnType = dom.type.void;
                }
                else if (!d.returns[0].type) {
                    logger_1.warnResolve(d, 5, `Type is not well-formed, defaulting to any.`);
                    o.returnType = dom.type.any;
                }
                else {
                    o.returnType = this._resolveType(d.returns[0], o);
                }
            }
            if (doclet.kind === 'typedef' && obj.type && obj.type.kind === 'object') {
                if (doclet.properties) {
                    obj.type.members = handleNestedProperties(doclet.properties).map((pDoc) => {
                        let propType;
                        if ((Object.keys(pDoc.props).length)) {
                            propType = dom.create.property(pDoc.meta.name, this._walkNestedProps(pDoc), handleFlags(pDoc.meta));
                        }
                        else {
                            propType = dom.create.property(pDoc.meta.name, null, handleFlags(pDoc.meta));
                            propType.type = this._resolveType(pDoc.meta, propType);
                        }
                        propType.jsDocComment = cleanComment(pDoc.meta.comment || pDoc.meta.description);
                        propType._doclet = doclet;
                        return propType;
                    });
                }
                obj.type.members.forEach((m) => {
                    m._parent = obj.type;
                });
            }
            if (doclet.kind === 'typedef' && !obj.type) {
                obj.type = this._resolveType(doclet, obj);
            }
            if (doclet.kind === 'member' || doclet.kind === 'constant') {
                if (!doclet.type && !doclet.properties) {
                    continue;
                }
                obj.type = this._resolveType(doclet, obj);
            }
            if (doclet.kind === 'class' || doclet.kind === 'mixin' || doclet.kind === 'interface') {
                const o = obj;
                let ctorObj = null;
                if (o.members && typeof o.members[Symbol.iterator] === 'function') {
                    for (const member of o.members) {
                        if (member.kind === 'constructor') {
                            ctorObj = member;
                        }
                    }
                }
                else {
                    logger_1.warn(`No members specified for ${doclet.kind} ${doclet.name} in ${doclet.meta.filename}`);
                }
                if (ctorObj) {
                    if (doclet.params) {
                        ctorObj.parameters = this._resolveFunctionParams(doclet.params);
                    }
                    for (const param of ctorObj.parameters) {
                        param._parent = ctorObj;
                    }
                }
                if (doclet.augments && doclet.augments.length) {
                    if (doclet.augments[0].startsWith('module:'))
                        doclet.augments[0] = doclet.augments[0].replace(moduleCheck, '');
                    const baseType = this.objects[doclet.augments[0]];
                    if (!baseType) {
                        logger_1.warnResolve(doclet, 3);
                    }
                    else {
                        if (o.kind === 'class') {
                            o.baseType = baseType;
                        }
                        else {
                            o.baseTypes.push(baseType);
                        }
                    }
                }
                if (doclet.implements && doclet.implements.length) {
                    if (o.kind === 'class') {
                        o.implements.push.apply(o.implements, doclet.implements.map((s) => this.objects[s]));
                    }
                    else {
                        o.baseTypes.push.apply(o.baseTypes, doclet.implements.map((s) => this.objects[s]));
                    }
                }
                if (doclet.mixes && doclet.mixes.length) {
                    for (const mix of doclet.mixes) {
                        const declaration = this.objects[mix];
                        if (o.kind === 'class') {
                            o.implements.push(declaration);
                        }
                        else {
                            o.baseTypes.push(declaration);
                        }
                    }
                }
            }
        }
    }
    _resolveInterfaceMembers(docs) {
        for (const doclet of docs) {
            if (!this._shouldResolveDoclet(doclet)) {
                continue;
            }
            const obj = this.objects[doclet.longname];
            if (!obj) {
                logger_1.warnResolve(doclet, 1);
                continue;
            }
            if (obj.kind === 'class') {
                for (const impl of obj.implements) {
                    for (const implMemb of impl.members) {
                        const implMember = Object.assign({}, implMemb);
                        if (implMember.kind === 'call-signature') {
                            continue;
                        }
                        let clsMember = null;
                        for (const member of obj.members) {
                            if (member.kind === 'constructor') {
                                continue;
                            }
                            if (member.name === implMember.name) {
                                clsMember = member;
                                break;
                            }
                        }
                        if (implMember.kind === 'property' && implMember.type.kind === 'function-type') {
                            implMember.kind = 'method';
                        }
                        if (!objEqual(clsMember, implMember)) {
                            obj.members.push(implMember);
                        }
                    }
                }
            }
        }
    }
    _resolveModules(classes) {
        for (let i = classes.length - 1; i >= 0; --i) {
            const res = classes[i];
            if (res.kind === 'class' || res.kind === 'interface') {
                this._doResolveClassModule(res);
            }
            else if (res.kind === 'module' || res.kind === 'namespace') {
                this._resolveModules(res.members);
            }
        }
    }
    _doResolveClassModule(clazz) {
        for (const m of clazz.members) {
            const member = m;
            if (member.kind === 'class' || member.kind === 'interface') {
                this._moveMemberToModule(member);
                this._doResolveClassModule(member);
            }
            else if (member.kind === 'alias') {
                this._moveMemberToModule(member);
            }
        }
    }
    _moveMemberToModule(obj) {
        const parent = obj._parent;
        const idx = parent.members.indexOf(obj);
        const top = parent._parent;
        if (!parent._module) {
            parent._module = dom.create.module(parent.name);
            if (top) {
                (top._module || top).members.push(parent._module);
            }
            else {
                this.results.push(parent._module);
            }
        }
        parent._module.members.push(obj);
        parent.members.splice(idx, 1);
    }
    _resolveType(doclet, obj) {
        const candidateType = doclet.type || doclet.properties && doclet.properties[0].type;
        if (!candidateType) {
            return dom.type.any;
        }
        const names = candidateType.names;
        const types = [];
        for (const t of names) {
            types.push(this._resolveTypeString(t, doclet, obj));
        }
        if (types.length === 0) {
            return dom.type.any;
        }
        if (types.length > 1) {
            return dom.create.union(types);
        }
        return doclet.variable ? dom.type.array(types[0]) : types[0];
    }
    _resolveTypeString(t, doclet, obj) {
        if (t.startsWith('(')) {
            t = t.replace('(', '');
        }
        if (t.endsWith(')')) {
            t = t.replace(/\)$/, '');
        }
        if (t.indexOf('module:') !== -1)
            t = t.replace(moduleCheck, '');
        if (t.startsWith('Array')) {
            const matches = t.match(rgxArrayType);
            if (matches) {
                if (matches[1]) {
                    return dom.create.array(this._resolveTypeString(matches[1], doclet, obj));
                }
                else {
                    return dom.create.array(dom.type.any);
                }
            }
        }
        if (t.startsWith('Map.<')) {
            t = t.replace('Map.<', 'Map<');
            return t;
        }
        if (t.startsWith('JQueryPromise.<')) {
            t = t.replace('JQueryPromise.<', 'JQueryPromise<');
            return t;
        }
        if (t.startsWith('Promise.<')) {
            t = t.replace('Promise.<', 'Promise<');
            return t;
        }
        if (t.startsWith('JQuery.<')) {
            t = t.replace('JQuery.<', 'JQuery<');
            return t;
        }
        if (t.startsWith('Class.<')) {
            t = t.replace('Class.<', '').replace('>', '');
            return 'typeof ' + t;
        }
        if (t.startsWith('Object.<')) {
            const matches = t.match(rgxObjectType);
            if (matches && matches[1] && matches[2]) {
                const indexTypeStr = matches[1].trim();
                const valueTypeStr = matches[2].trim();
                if (indexTypeStr !== 'string' && indexTypeStr !== 'number') {
                    logger_1.warn(`Invalid object index type: "${matches[1]}", must be "string" or "number". Falling back to "any".`);
                    return dom.type.any;
                }
                return dom.create.objectType([
                    dom.create.indexSignature('key', indexTypeStr, this._resolveTypeString(valueTypeStr, doclet, obj)),
                ]);
            }
        }
        else if (t.startsWith('Object')) {
            return dom.type.any;
        }
        let p = obj;
        let depth = 0;
        while (p && depth < 20) {
            if (p.typeParameters) {
                for (const g of p.typeParameters) {
                    if (t === g.name) {
                        return t;
                    }
                }
            }
            depth += 1;
            p = p._parent;
        }
        const possiblePrimitive = /^[A-Z]/.test(t) ? t.toLowerCase() : t;
        if (possiblePrimitive === dom.type.string
            || possiblePrimitive === dom.type.number
            || possiblePrimitive === dom.type.boolean
            || possiblePrimitive === dom.type.true
            || possiblePrimitive === dom.type.false
            || possiblePrimitive === dom.type.object
            || possiblePrimitive === dom.type.any
            || possiblePrimitive === dom.type.null
            || possiblePrimitive === dom.type.undefined
            || possiblePrimitive === dom.type.void) {
            return possiblePrimitive;
        }
        if (possiblePrimitive === 'function') {
            return dom.create.functionType([], dom.type.any);
        }
        if (t === '*') {
            return dom.type.any;
        }
        if (t.includes('|')) {
            return dom.create.union(t.split('|').map((v) => this._resolveTypeString(v, doclet, obj)));
        }
        if (this.objects[t]) {
            return this.objects[t];
        }
        else {
            try {
                const val = eval(t);
                const evalType = typeof val;
                if (evalType === 'number') {
                    return dom.type.numberLiteral(val);
                }
                else if (evalType === 'string') {
                    return dom.type.stringLiteral(val);
                }
                else {
                    logger_1.warn(`Unable to handle eval type "${evalType}", defaulting to "any"`);
                }
            }
            catch (_a) {
                logger_1.warn(`Unable to resolve type name "${t}" for "${doclet.longname || doclet.description}". No type found with that name, defaulting to "any".`);
            }
            return dom.type.any;
        }
    }
    _createClass(doclet) {
        const obj = this.objects[doclet.longname] = dom.create.class(doclet.name);
        obj._doclet = doclet;
        if (doclet.params) {
            const ctorParams = [];
            for (const param of doclet.params) {
                const p = dom.create.parameter(param.name, null, handleParameterFlags(param));
                ctorParams.push(p);
            }
            const ctor = dom.create.constructor(ctorParams, handleFlags(doclet));
            ctor._doclet = doclet;
            obj.members.push(ctor);
        }
    }
    _createInterface(doclet) {
        const obj = this.objects[doclet.longname] = dom.create.interface(doclet.name);
        obj._doclet = doclet;
    }
    _createMember(doclet) {
        let obj = null;
        if (doclet.isEnum) {
            obj = dom.create.enum(doclet.name, doclet.kind === 'constant');
        }
        else {
            const o = this.objects[doclet.memberof];
            if (o && o.kind === 'enum') {
                return;
            }
            obj = o && o.kind === 'namespace'
                ? dom.create.const(doclet.name, null, handleFlags(doclet))
                : dom.create.property(doclet.name, null, handleFlags(doclet));
        }
        obj._doclet = doclet;
        this.objects[doclet.longname] = obj;
        if (doclet.isEnum && doclet.properties) {
            for (const property of doclet.properties) {
                const propNode = property.meta.code;
                const val = dom.create.enumValue(propNode.name);
                val.jsDocComment = cleanComment(property.comment);
                obj.members.push(val);
            }
        }
    }
    _createFunction(doclet) {
        const obj = this.objects[doclet.longname] = dom.create.function(doclet.name, [], null, handleFlags(doclet));
        obj._doclet = doclet;
    }
    _createNamespace(doclet) {
        const obj = this.objects[doclet.longname] = dom.create.namespace(doclet.name);
        obj._doclet = doclet;
    }
    _createTypedef(doclet) {
        if (!doclet.type || !doclet.type.names || !doclet.type.names.length) {
            //logger_1.warn(`No type specified on typedef "${doclet.longname}", assuming "object".`);
            doclet.type = { names: ['object'] };
        }
        const typeName = doclet.type.names[0];
        let type = null;
        switch (typeName.toLowerCase()) {
            case 'function':
                type = dom.create.functionType([], null);
                break;
            case 'object':
                type = dom.create.objectType([]);
                break;
        }
        const obj = this.objects[doclet.longname] = dom.create.alias(doclet.name, type, handleFlags(doclet));
        obj._doclet = doclet;
    }
    _shouldResolveDoclet(doclet) {
        const parent = this.objects[doclet.memberof];
        return (!doclet.ignore
            && doclet.kind !== 'package'
            && (!parent || parent.kind !== 'enum')
            && (this.config.private || doclet.access !== 'private'));
    }
    _resolveFunctionParams(params) {
        return handleNestedProperties(params).map((p) => {
            if ((Object.keys(p.props).length)) {
                const param = dom.create.parameter(p.meta.name, this._walkNestedProps(p), handleParameterFlags(p.meta));
                return param;
            }
            else {
                const param = dom.create.parameter(p.meta.name, null, handleParameterFlags(p.meta));
                param.type = this._resolveType(p.meta, param);
                return param;
            }
        });
    }
    _walkNestedProps(p) {
        const props = Object.keys(p.props).map((pKey) => {
            return this._walkNestedProp(p.props[pKey], pKey);
        });
        return dom.create.objectType(props);
    }
    _walkNestedProp(p, key) {
        const hasNestProps = Object.keys(p.props).length;
        const param = dom.create.property(key, hasNestProps ? this._walkNestedProps(p) : null, handleFlags(p.meta));
        param.type = this._resolveType(p.meta, param);
        return param;
    }
}
exports.default = Emitter;
function handleFlags(doclet) {
    let flags = dom.DeclarationFlags.None;
    flags |= accessFlagMap[doclet.access];
    flags |= doclet.optional || doclet.defaultvalue !== undefined ? dom.DeclarationFlags.Optional : dom.DeclarationFlags.None;
    flags |= doclet.virtual ? dom.DeclarationFlags.Abstract : dom.DeclarationFlags.None;
    flags |= doclet.readonly ? dom.DeclarationFlags.ReadOnly : dom.DeclarationFlags.None;
    flags |= doclet.scope === 'static' ? dom.DeclarationFlags.Static : dom.DeclarationFlags.None;
    return flags;
}
function handleParameterFlags(doclet) {
    let flags = dom.ParameterFlags.None;
    flags |= accessFlagMap[doclet.access];
    flags |= doclet.optional || doclet.defaultvalue !== undefined ? dom.ParameterFlags.Optional : dom.ParameterFlags.None;
    flags |= doclet.variable ? dom.ParameterFlags.Rest : dom.ParameterFlags.None;
    return flags;
}
function handleCustomTags(doclet, obj) {
    if (!doclet.tags || !doclet.tags.length) {
        return;
    }
    for (const tag of doclet.tags) {
        switch (tag.title) {
            case 'template':
                obj.typeParameters.push(dom.create.typeParameter(tag.value));
                break;
        }
    }
}
function handleNestedProperties(properties) {
    const nestedCache = { props: {} };
    const nestedProps = [];
    properties.forEach((prop) => {
        const segs = prop.name ? prop.name.split('.') : [];
        if (!nestedCache.props[segs[0]]) {
            makeNestObject(segs, nestedCache, prop);
            nestedProps.push(nestedCache.props[segs[0]]);
        }
        else {
            makeNestObject(segs, nestedCache, prop);
        }
    });
    return nestedProps;
}
function makeNestObject(segs, context, meta) {
    for (const seg of segs) {
        context.props[seg] = context.props[seg] || { meta: null, props: {} };
        context = context.props[seg];
    }
    context.meta = Object.assign({}, meta, { name: meta.name.split('.').pop() });
}
function objEqual(o1, o2) {
    if (!o1 || !o2) {
        return (o1 === o2);
    }
    for (const k in o1) {
        if (o1[k] !== o2[k]) {
            return false;
        }
    }
    for (const k in o2) {
        if (o2[k] !== o1[k]) {
            return false;
        }
    }
    return true;
}
function cleanComment(s) {
    if (!s) {
        return '';
    }
    if (s.indexOf('module:') !== -1)
        s = s.replace(moduleCheck, '');
    const cleanLines = [];
    for (const line of s.split(/\r?\n/g)) {
        const cleaned = line.trim()
            .replace(rgxJsDocHeader, '')
            .replace(rgxJsDocFooter, '')
            .replace(rgxJsDocBody, '');
        if (cleaned) {
            cleanLines.push(cleaned);
        }
    }
    return cleanLines.join('\n');
}
//# sourceMappingURL=Emitter.js.map