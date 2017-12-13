'use strict';

var versionInfo = require('./lib/version-info/version-info.js');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  var path = require('path');

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
          'test/**/*.js'
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

    webpack: {
      options: {
        cache: true,
        entry: {
          JumpStart: './src/jumpstart.js'
        },
        output: {
          path: path.join(__dirname, 'build'),
          publicPath: 'build/',
          filename: '[name].js'
        }
      },
      build: {
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

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('pack', ['webpack:build']);
  grunt.registerTask('package', ['clean', 'pack', 'uglify']);
  grunt.registerTask('test:core', 'Run the unit tests with Karma', ['tests:core']);
  grunt.registerTask('test', 'Run tests', ['eslint', 'package', 'test:core']);
  grunt.registerTask('default', ['test']);

};
