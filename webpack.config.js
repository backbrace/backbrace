'use strict';

var webpack = require('webpack'),
  versionInfo = require('./lib/version-info/version-info.js');

module.exports = {
  cache: true,
  entry: {
    backbrace: ['./packages/backbrace-core/src/backbrace.js']
  },
  devtool: 'source-map',
  devServer: {},
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            'targets': {
              'browsers': [
                'last 2 versions',
                'ie >= 9'
              ]
            },
            'useBuiltIns': 'usage'
          }]],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }]
  },
  plugins: [
    new webpack.BannerPlugin(
      '@license ' + versionInfo.currentPackage.name + ' v' + versionInfo.currentVersion.full +
      '\n' + versionInfo.currentPackage.author +
      '\nLicense: ' + versionInfo.currentPackage.license),
    new webpack.DefinePlugin({
      __CDNSERVER__: JSON.stringify('https://labs.zoomapps.com.au/JumpstartCDN/' + versionInfo.currentVersion.version)
    })
  ]
};
