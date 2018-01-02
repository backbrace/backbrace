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
    files: [
      'build/jumpstart.js',
      'test/**/*.js'
    ]
  });
};
