'use strict';

var path = require('path');
module.exports = {
    cache: true,
    entry: {
        JumpStart: './src/jumpstart.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'build/',
        filename: '[name].js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'website/'
    }
};
