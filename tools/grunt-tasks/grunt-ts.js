var packages = require('../utils/packages');

// Type check the source code.
module.exports = {
    default: {
        src: [
            packages.core + '/src/**/*.js',
            packages.core + '/test/**/*.js',
            packages.docs + '/src/design/**/*.js'
        ],
        tsconfig: './jsconfig.json',
        options: {
            additionalFlags: '--allowJs --checkJs --noEmit --target ES6'
        }
    }
};
