'use strict';

var versionInfo = require('./lib/version-info/version-info.js');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  var webpackConfig = require('./webpack.config.js');

  //Get the current version info.
  var JS_VERSION = versionInfo.currentVersion;

  //Project configuration.
  grunt.initConfig({
    JS_VERSION: JS_VERSION,

    //Clean build directories.
    clean: {
      build: ['build', 'docs'],
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
      options: webpackConfig,
      build: {
      }
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig,
        publicPath: '/scripts',
        contentBase: 'server/wwwroot/'
      },
      start: {}
    },

    uglify: {
      options: {
        mangle: false
      },
      jumpStart: {
        files: {
          'build/jumpstart.min.js': ['build/jumpstart.js']
        }
      }
    },

    jsdoc: {
      dist: {
        src: ['src/*.js','src/*/*.js','README.md'],
        options: {
          destination: 'docs',
          template: 'node_modules/jumpstartjs-jsdoc-template',
          config: 'jsdoc.conf.json'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('docs', ['jsdoc:dist']);
  grunt.registerTask('startdev', ['webpack-dev-server:start']);
  grunt.registerTask('pack', ['webpack:build']);
  grunt.registerTask('package', ['clean', 'pack', 'uglify']);
  grunt.registerTask('test:core', 'Run the unit tests with Karma', ['tests:core']);
  grunt.registerTask('build', [
    'eslint',
    'package',
    'test:core',
    'docs'
  ]);
  grunt.registerTask('default', ['build']);

};
