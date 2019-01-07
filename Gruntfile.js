'use strict';

var path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  moment = require('moment'),
  globals = require('./lib/globals/global-vars');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');
  grunt.loadNpmTasks('git-changelog');

  var webpackconfig = require('./webpack.config'),
    versionInfo = require('./lib/version-info/version-info.js'),
    paths = {
      core: 'packages/backbrace-core/',
      devkit: 'packages/backbrace-devkit/',
      packages: 'packages/backbrace-packages/',
      sampleapp: 'packages/backbrace-sample-app/'
    };

  //Project configuration.
  grunt.initConfig({

    //Clean directories.
    clean: {
      dist: [
        'packages/backbrace-core/dist',
        'packages/backbrace-devkit/typings',
        'packages/backbrace-packages/dist'
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
          library: 'backbrace',
          filename: '[name].js'
        }
      }, webpackconfig),
      prod: merge({
        mode: 'production',
        output: {
          path: path.join(__dirname, 'packages/backbrace-core/dist'),
          publicPath: 'packages/backbrace-core/dist/',
          library: 'backbrace',
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
            library: 'backbrace',
            filename: '[name].js'
          },
          plugins: [
            new webpack.DefinePlugin(globals.get(true))
          ]
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
          'packages/backbrace-core/src/globals.js',
          'packages/backbrace-core/src/app.js',
          'packages/backbrace-core/src/promises.js',
          'packages/backbrace-core/src/module.js',
          'packages/backbrace-core/src/log.js',
          'packages/backbrace-core/src/util.js',
          'packages/backbrace-core/src/http.js',
          'packages/backbrace-core/src/providers/style.js'
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

    copy: {
      packages: {
        files: [
          { expand: true, cwd: paths.packages + 'node_modules/@mdi/font', src: ['css/**', 'fonts/**', 'scss/**', '*.md'], dest: paths.packages + 'dist/materialdesignicons' },
          { expand: true, cwd: paths.packages + 'node_modules/ace-builds/src', src: ['**'], dest: paths.packages + 'dist/ace/src' },
          { expand: true, cwd: paths.packages + 'node_modules/ace-builds/src-min', src: ['**'], dest: paths.packages + 'dist/ace/min' },
          { expand: true, cwd: paths.packages + 'src/ace', src: ['**'], dest: paths.packages + 'dist/ace' },
          { expand: true, cwd: paths.packages + 'node_modules/jquery/dist', src: ['**'], dest: paths.packages + 'dist/jquery' },
          { expand: true, cwd: paths.packages + 'node_modules/jquery-ripple', src: ['*.js', '*.css', '*.md'], dest: paths.packages + 'dist/jquery-ripple' },
          { expand: true, cwd: paths.packages + 'node_modules/jquery-ui-dist', src: ['**'], dest: paths.packages + 'dist/jquery-ui' },
          { expand: true, cwd: paths.packages + 'node_modules/moment', src: ['locale/**', 'moment.js', '*.md', 'LICENSE'], dest: paths.packages + 'dist/moment' },
          { expand: true, cwd: paths.packages + 'node_modules/moment/min', src: ['moment.min.js'], dest: paths.packages + 'dist/moment' },
          { expand: true, cwd: paths.packages + 'node_modules/reset-css', src: ['**'], dest: paths.packages + 'dist/resetcss' },
          { expand: true, cwd: paths.packages + 'node_modules/roboto-fontface', src: ['**'], dest: paths.packages + 'dist/roboto' },
          {
            expand: true, cwd: paths.packages + 'node_modules/sweetalert/dist', src: ['**'], dest: paths.packages + 'dist/sweetalert', rename: function(dest, src) {
              return dest + '/' + src.replace('-dev', '');
            }
          },
          { expand: true, cwd: paths.packages + 'src/jqgrid', src: ['**'], dest: paths.packages + 'dist/jqgrid' }
        ]
      }
    },

    git_changelog: {
      dist: {
        options: {
          app_name: versionInfo.currentPackage.name,
          template: './lib/grunt/changelog-template.md',
          file: './tmp/CHANGELOG.md',
          version_name: versionInfo.currentVersion.full,
          intro: moment().format('YYYY-MM-DD'),
          logo: versionInfo.previousVersions.slice(-1).pop(),
          tag: 'v' + versionInfo.previousVersions.slice(-1).pop(),
          "sections": [
            {
              "title": "Bug Fixes",
              "grep": "^fix"
            },
            {
              "title": "Features",
              "grep": "^feat"
            },
            {
              "title": "Breaking changes",
              "grep": "BREAKING"
            }
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('changelog', ['git_changelog:dist']);
  grunt.registerTask('test', 'Run the unit tests with Karma', [
    'eslint',
    'package',
    'copy:packages',
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
    'copy:packages',
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
