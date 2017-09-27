'use strict';

var jumpStartFiles = {

  'jumpStartCore': [
    'src/Core/logHelper.js',
    'src/Core/eventHelper.js',
    'src/Core/loaderHelper.js',
    'src/Core/packageHelper.js',
    'src/Core/codeHelper.js',
    'src/Core/styleHelper.js',
    'src/Core/contentLoaded.js',
    'src/Core/page.js',
    'src/Core/table.js',
    'src/Core/appHelper.js',
    'src/Core/jumpStart.js'
  ],

  'jumpStartComponents': [
    'src/Components/Helpers/alertHelper.js',
    'src/Components/Styles/flat.js',
    'src/Components/appComponent.js',
    'src/Components/headerComponent.js',
    'src/Components/windowComponent.js',
    'src/Components/pageComponent.js'
  ],

  'jumpStartTest': [
    'test/*.js',
    'test/Core/**/*.js'
  ],

  'karma': [
    '@jumpStartCore',
    '@jumpStartTest'
  ]

};

if (exports) {

  exports.files = jumpStartFiles;
  exports.mergeFilesFor = function() {

    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      jumpStartFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^@(.*)/);
        if (match) {
          files = files.concat(jumpStartFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}
