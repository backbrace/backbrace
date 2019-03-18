'use strict';

var path = require('path'),
  webpack = require('webpack'),
  globals = require('./lib/globals/global-vars'),
  versionInfo = require('./lib/version-info/version-info.js');

module.exports = {
  cache: true,
  entry: {
    backbrace: ['./packages/backbrace-core/src/backbrace.js']
  },
  devtool: 'source-map',
  devServer: {},
  resolve: {
    alias: {
      'jquery': 'modules/jquery/dist/jquery.js',
      'modules': path.join(__dirname, './node_modules')
    }
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
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
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-syntax-dynamic-import'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner:
        '@license ' + versionInfo.currentPackage.name + ' v' + versionInfo.currentVersion.full +
        '\n' + versionInfo.currentPackage.author +
        '\nLicense: ' + versionInfo.currentPackage.license,
      entryOnly: true,
      include: 'backbrace.js'
    }),
    new webpack.DefinePlugin(globals.get()),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};
