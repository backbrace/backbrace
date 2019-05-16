var sass = require('rollup-plugin-sass');

module.exports = {
    input: 'packages/backbrace-core/src/backbrace.js',
    external: ['jquery'],
    inlineDynamicImports: true,
    output: {
        file: 'packages/backbrace-devkit/tern/temp/backbrace.js',
        format: 'iife',
        name: 'backbrace',
        globals: {
            jquery: '$'
        }
    },
    plugins: [
        sass()
    ]
};
