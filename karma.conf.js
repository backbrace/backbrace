'use strict';

var webpack = require('webpack'),
  globals = require('./lib/globals/global-vars');

module.exports = function(config) {
  var configuration = {
    frameworks: ['jasmine'],
    autoWatch: true,
    logColors: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    reporters: ['spec'],
    files: [
      { pattern: 'packages/backbrace-packages/dist/**', included: false, served: true, watched: false, nocache: true },
      'packages/backbrace-core/test/**/*.js'
    ],
    preprocessors: {
      'packages/backbrace-core/test/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      plugins: [
        new webpack.DefinePlugin(globals.get())
      ]
    },
    webpackMiddleware: {
      stats: 'errors-only'
    }
  };

  if (process.env.TRAVIS)
    configuration.browsers = ['ChromeTravisCI'];

  config.set(configuration);

};
