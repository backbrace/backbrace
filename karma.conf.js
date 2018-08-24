'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    autoWatch: true,
    logColors: true,
    browsers: ['Chrome'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    reporters: ['spec'],
    files: [
      'packages/core/test/**/*.js'
    ],
    preprocessors: {
      'packages/core/test/**/*.js': ['webpack']
    },
    webpack: {
      cache: true
    },
    webpackMiddleware: {
      stats: 'errors-only'
    }
  });
};
