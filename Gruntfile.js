'use strict';

var files = require('./jumpStartFiles').files;
var util = require('./lib/grunt/utils.js');
var versionInfo = require('./lib/version-info/version-info.js');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  //Get the current version info.
  var JS_VERSION = versionInfo.currentVersion;

  //Project configuration.
  grunt.initConfig({
    JS_VERSION: JS_VERSION,

    //Clean build directories.
    clean: {
      build: ['build'],
      tmp: ['tmp']
    },

    //Lint javascript.
    eslint: {
      all: {
        src: [
          '*.js',
          'src/**/*.js',
          '!src/Bind.js'
        ]
      }
    },

    //Karma tests.
    tests: {
      core: 'karma.conf.js'
    },

    //Auto Karma tests.
    autotest: {
      core: 'karma.conf.js'
    },

    //Build targets.
    build: {

      //JumpStart source.
      jumpStart: {
        dest: 'build/JumpStart.js',
        src: [
          util.wrap([files['jumpStartCore']], 'core'),
          util.wrap([files['jumpStartComponents']], 'module')
        ]
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      jumpStart: {
        files: {
          'build/JumpStart.min.js': ['build/JumpStart.js']
        }
      }
    }

  });

  grunt.registerTask('package', ['clean', 'buildall', 'uglify']);
  grunt.registerTask('test:core', 'Run the unit tests with Karma', ['build', 'tests:core']);
  grunt.registerTask('test', 'Run tests', ['eslint', 'package']); //TODO ADD unit tests
  grunt.registerTask('default', ['test']);

};
