'use strict';

var path = require('path'),
    merge = require('webpack-merge'),
    baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'build/',
        library: 'js',
        filename: '[name].js'
    },
    devtool: 'source-map',
    devServer: {
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
});
