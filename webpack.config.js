var path = require('path'),
    webpackconfig = require('./webpack.base').get();

webpackconfig.output.path = path.join(__dirname, 'packages/backbrace-core/dist');

module.exports = webpackconfig;
