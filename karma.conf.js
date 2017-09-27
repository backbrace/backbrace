'use strict';

var jumpStartFiles = require('./jumpStartFiles');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    autoWatch: true,
    logColors: true,
    browsers: ['Chrome'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    files: jumpStartFiles.mergeFilesFor('karma')
  });
};
