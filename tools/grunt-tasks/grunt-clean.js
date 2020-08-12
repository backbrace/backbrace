var packages = require('../utils/packages');

// Clean directories.
module.exports = {
    dist: [
        'dist',
        packages.core + '/dist',
        packages.schema + '/schema/icons.json',
        packages.schema + '/schema/pagedesign.json',
        packages.schema + '/schema/tabledesign.json',
        packages.schema + '/typings',
        packages.docs + '/dist',
        packages.docs + '/src/node_modules'
    ],
    tmp: [
        'tmp',
        '.tscache'
    ]
};
