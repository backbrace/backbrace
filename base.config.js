'use strict';

var webpack = require('webpack'),
    versionInfo = require('./lib/version-info/version-info.js');

module.exports = {
    cache: true,
    entry: {
        jumpstart: ['./src/jumpstart.js']
    },
    plugins: [
        new webpack.BannerPlugin(
            '@license JumpstartJS v' + versionInfo.currentVersion.full +
            '\n(c) 2018 Zoom Apps https://zoomapps.com.au' +
            '\nLicense: MIT')
    ]
};
