"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const helper = require("jsdoc/util/templateHelper");
const Emitter_1 = require("./Emitter");
function publish(data, opts) {
    data({ undocumented: true }).remove();
    const docs = data().get();
    const emitter = new Emitter_1.default(docs, opts);
    if (opts.destination === 'console') {
        console.log(emitter.emit());
    }
    else {
        try {
            fs.mkdirSync(opts.destination);
        }
        catch (e) {
            if (e.code !== 'EEXIST') {
                throw e;
            }
        }
        const pkg = (helper.find(data, { kind: 'package' }) || [])[0];
        const out = path.join(opts.destination, pkg && pkg.name ? `${pkg.name}.d.ts` : 'types.d.ts');
        fs.writeFileSync(out, emitter.emit());
    }
}
exports.publish = publish;
;
//# sourceMappingURL=publish.js.map