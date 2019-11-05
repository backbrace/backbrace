'use strict';

var path = require('path'),
  webpack = require('webpack'),
  globals = require('./lib/globals/global-vars');

module.exports = function(config) {
  var configuration = {
    frameworks: ['jasmine'],
    autoWatch: true,
    logColors: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    reporters: ['spec'],
    files: [
      'packages/backbrace-core/test/**/*.js'
    ],
    preprocessors: {
      'packages/backbrace-core/test/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      resolve: {
        alias: {
          'jquery': 'npm/jquery/dist/jquery.js',
          'jquery-ui': 'npm/jquery-ui-dist/jquery-ui.js',
          'moment': 'npm/moment/moment.js',
          'sweetalert': 'npm/sweetalert/dist/sweetalert-dev.js',
          'npm': path.join(__dirname, './node_modules'),
          'modules': path.join(__dirname, './modules')
        }
      },
      plugins: [
        new webpack.DefinePlugin(globals.get()),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
      ]
    },
    webpackMiddleware: {
      stats: 'errors-only'
    }
  };

  if (process.env.CI)
    configuration.browsers = ['ChromeCI'];

  config.set(configuration);

};
