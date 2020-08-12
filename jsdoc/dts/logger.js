"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function warn(...args) {
    args.unshift('[dts-generator]');
    return console && console.warn.apply(console, args);
}
exports.warn = warn;
function warnResolve(doclet, reason, message = '') {
    let str = '';
    switch (reason) {
        case 0:
            str = `Unable to resolve memberof for "${doclet.longname}", using memberof "${doclet.memberof}".`;
            break;
        case 1:
            str = `Unable to find object for longname "${doclet.longname}".`;
            break;
        case 2:
            str = `Type is required for doclet of type "${doclet.kind}" but none found for "${doclet.longname}".`;
            break;
        case 3:
            str = `Failed to resolve base type of "${doclet.longname}", no object found with name "${doclet.augments[0]}".`;
            break;
        case 4:
            str = `Unable to resolve function param type for longname "${doclet.longname}".`;
            break;
        case 5:
            str = `Unable to resolve function return type for longname "${doclet.longname}".`;
            break;
    }
    if (message) {
        str += ` ${message}`;
    }
    warn(str);
}
exports.warnResolve = warnResolve;
//# sourceMappingURL=logger.js.map