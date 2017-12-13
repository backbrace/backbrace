'use strict';

/* eslint-disable no-invalid-this */

var util = require('./utils.js');

module.exports = function(grunt) {

  grunt.registerMultiTask('tests', 'run tests using karma', function() {
    util.startKarma(this.data, true, this.async());
  });

  grunt.registerMultiTask('autotest', 'run and watch the unit tests with Karma', function() {
    util.startKarma(this.data, false, this.async());
  });

};
