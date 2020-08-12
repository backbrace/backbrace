var packages = require('../utils/packages');

// Lint the source code.
module.exports = {
    all: {
        src: [
            packages.core + '/src/**/*.js',
            packages.core + '/test/**/*.js'
        ]
    }
};
