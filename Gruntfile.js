'use strict';

var path = require('path'),
  merge = require('webpack-merge');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  var webpackconfig = require('./webpack.config'),
    versionInfo = require('./lib/version-info/version-info.js');

  //Project configuration.
  grunt.initConfig({

    //Clean directories.
    clean: {
      dist: [
        'packages/backbrace-core/dist',
        'packages/backbrace-devkit/typings'
      ],
      tmp: ['tmp']
    },

    //Lint javascript.
    eslint: {
      all: {
        src: [
          'packages/backbrace-core/src/**/*.js',
          'packages/backbrace-core/test/**/*.js'
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
      dev: merge({
        mode: 'development',
        output: {
          path: path.join(__dirname, 'packages/backbrace-core/dist'),
          publicPath: 'packages/backbrace-core/dist/',
          library: 'bb',
          filename: '[name].js'
        }
      }, webpackconfig),
      prod: merge({
        mode: 'production',
        output: {
          path: path.join(__dirname, 'packages/backbrace-core/dist'),
          publicPath: 'packages/backbrace-core/dist/',
          library: 'bb',
          filename: '[name].min.js'
        }
      }, webpackconfig)
    },

    'webpack-dev-server': {
      sampleapp: {
        webpack: {
          mode: 'none',
          entry: {
            backbrace: ['./packages/backbrace-core/src/backbrace.js']
          },
          devtool: 'source-map',
          devServer: {},
          output: {
            library: 'bb',
            filename: '[name].js'
          }
        },
        publicPath: '/scripts',
        contentBase: ['packages/backbrace-sample-app', 'packages/backbrace-packages'],
        port: 8000
      }
    },

    jsdoc: {
      dist: {
        src: ['packages/backbrace-core/src/*.js', 'packages/backbrace-core/src/*/*.js', 'packages/backbrace-core/src/*/*/*.js', 'README.md'],
        options: {
          destination: 'docs',
          config: 'jsdoc.conf.json'
        }
      },
      typings: {
        src: [
          'packages/backbrace-core/src/types.js',
          'packages/backbrace-core/src/classes/*.js',
          'packages/backbrace-core/src/components/*.js',
          'packages/backbrace-core/src/components/*/*.js',
          'packages/backbrace-core/src/backbrace.js',
          'packages/backbrace-core/src/app.js',
          'packages/backbrace-core/src/code.js',
          'packages/backbrace-core/src/controller.js',
          'packages/backbrace-core/src/log.js'
        ],
        options: {
          private: false,
          destination: './packages/backbrace-devkit/typings',
          template: 'node_modules/@backbrace/dts-generator/dist',
          config: './packages/backbrace-devkit/jsdoc.conf.json'
        }
      }
    },

    file_append: {
      typings: {
        files: [{
          prepend: "/**\n" +
            "* Type definitions for " + versionInfo.currentPackage.name + " v" + versionInfo.currentVersion.full + "\n" +
            "* " + versionInfo.currentPackage.author + "\n" +
            "* Project: " + versionInfo.currentPackage.repository.url + "\n" +
            "* License: " + versionInfo.currentPackage.license + "\n" +
            "* Definitions by: @backbrace/dts-generator\n" +
            "*/\n\n",
          input: './packages/backbrace-devkit/typings/types.d.ts',
          output: './packages/backbrace-devkit/typings/types.d.ts'
        }]
      }
    },

    subgrunt: {
      packages: {
        options: {
        },
        projects: {
          'packages/backbrace-packages': 'default'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('test', 'Run the unit tests with Karma', [
    'eslint',
    'package',
    'subgrunt:packages',
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
  grunt.registerTask('sampleapp', [
    'subgrunt:packages',
    'webpack-dev-server:sampleapp'
  ]);
  grunt.registerTask('package', [
    'clean',
    'build',
    'webpack:prod',
    'docs',
    'typings'
  ]);
  grunt.registerTask('default', ['package']);

};
