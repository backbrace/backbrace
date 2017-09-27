'use strict';

/* eslint-disable no-invalid-this */

var util = require('./utils.js');

module.exports = function(grunt) {

  grunt.registerMultiTask('build', 'build JS files', function() {
    util.build(this.data, this.async());
  });

  grunt.registerTask('buildall', 'build all the JS files in parallel', function() {
    var builds = grunt.config('build');
    builds = Object.keys(builds).map(function(key) {
        return builds[key];
    });
    grunt.util.async.forEach(builds, util.build.bind(util), this.async());
  });

  grunt.registerMultiTask('tests', 'run tests using karma', function() {
    util.startKarma(this.data, true, this.async());
  });

  grunt.registerMultiTask('autotest', 'run and watch the unit tests with Karma', function() {
    util.startKarma(this.data, false, this.async());
  });

};
