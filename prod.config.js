'use strict';

var path = require('path'),
    merge = require('webpack-merge'),
    baseConfig = require('./base.config.js'),
    ClosurePlugin = require('closure-webpack-plugin');

module.exports = merge(baseConfig, {
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'build/',
        library: 'js',
        filename: '[name].min.js'
    },
    plugins: [
        new ClosurePlugin({ mode: 'STANDARD' })
    ]
});
