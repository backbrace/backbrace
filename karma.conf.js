'use strict';

var webpackconfig = require('./webpack.config');

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
    basePath: 'packages/backbrace-core',
    files: [
      { pattern: 'dist/**/*.js', watched: true, included: false, served: true, nocache: true },
      { pattern: 'test/design/**/*.json', watched: true, included: false, served: true, nocache: true },
      { pattern: 'test/design/**/*.js', watched: true, included: false, served: true, nocache: true },
      'test/*.spec.js'
    ],
    proxies: {
      '/design/': '/base/test/design/',
      '/dist/': '/base/dist/'
    },
    preprocessors: {
      'test/*.spec.js': ['webpack'],
      'test/design/**/*.js': ['webpack']
    },
    webpack: webpackconfig.get(true),
    webpackMiddleware: {
      stats: 'errors-only'
    }
  };

  if (process.env.CI)
    configuration.browsers = ['ChromeCI'];

  config.set(configuration);

};
