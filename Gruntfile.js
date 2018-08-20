'use strict';

var path = require('path');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  var pkg = require('./package.json');
  var webpackconfig = require('./webpack.config');

  //Project configuration.
  grunt.initConfig({

    //Clean build directories.
    clean: {
      build: ['build'],
      tmp: ['tmp'],
      deploy: ['docs']
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
      dev: Object.assign({
        mode: 'development',
        output: {
          path: path.join(__dirname, 'build'),
          publicPath: 'build/',
          library: 'js',
          filename: '[name].js'
        }
      }, webpackconfig),
      prod: Object.assign({
        mode: 'production',
        output: {
          path: path.join(__dirname, 'build'),
          publicPath: 'build/',
          library: 'js',
          filename: '[name].min.js'
        }
      }, webpackconfig)
    },

    'webpack-dev-server': {
      core: {
        webpack: {
          mode: 'none',
          entry: {
            jumpstart: ['./src/jumpstart.js']
          },
          devtool: 'source-map',
          devServer: {},
          output: {
            library: 'js',
            filename: '[name].js'
          }
        },
        publicPath: '/scripts',
        contentBase: 'sample',
        port: 8000
      }
    },

    jsdoc: {
      dist: {
        src: ['src/*.js', 'src/*/*.js', 'src/*/*/*.js', 'README.md'],
        options: {
          destination: 'docs',
          template: 'node_modules/jumpstartjs-jsdoc-template',
          config: 'jsdoc.conf.json'
        }
      },
      typings: {
        src: [
          'src/types.js',
          'src/classes/*.js',
          'src/components/*.js',
          'src/components/*/*.js',
          'src/jumpstart.js',
          'src/app.js',
          'src/code.js',
          'src/controller.js',
          'src/log.js'
        ],
        options: {
          private: false,
          destination: 'typings',
          template: 'node_modules/tsd-jsdoc/dist',
          config: 'typings.conf.json'
        }
      }
    },

    file_append: {
      typings: {
        files: [{
          prepend: "/**\n" +
            "* Type definitions for " + pkg.name + "\n" +
            "* Project: " + pkg.repository.url + "\n" +
            "* Definitions by: tsd-doc\n" +
            "*/\n\n",
          input: './typings/types.d.ts',
          output: './typings/types.d.ts'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('test', 'Run the unit tests with Karma', [
    'eslint',
    'package',
    'test:core'
  ]);
  grunt.registerTask('test:core', 'Run the unit tests with Karma', ['tests:core']);
  grunt.registerTask('docs', ['jsdoc:dist']);
  grunt.registerTask('typings', [
    'jsdoc:typings',
    'file_append:typings'
  ]);
  grunt.registerTask('generate', 'Generate docs and typings', [
    'docs',
    'typings'
  ]);
  grunt.registerTask('build', [
    'webpack:dev'
  ]);
  grunt.registerTask('webserver', ['webpack-dev-server:core']);
  grunt.registerTask('package', [
    'clean',
    'build',
    'webpack:prod',
    'docs',
    'typings'
  ]);
  grunt.registerTask('default', ['package']);

};
