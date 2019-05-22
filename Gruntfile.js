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
      docs: 'packages/backbrace-docs/',
      sampleapp: 'packages/backbrace-sample-app/'
    };

  //Project configuration.
  grunt.initConfig({

    //Clean directories.
    clean: {
      dist: [
        'packages/backbrace-core/dist',
        'packages/backbrace-devkit/typings',
        'packages/backbrace-docs/dist'
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
      prod: merge({
        output: {
          path: path.join(__dirname, 'packages/backbrace-core/dist'),
          library: 'backbrace',
          filename: '[name].min.js',
          chunkFilename: '[name].[contenthash:8].min.js'
        }
      }, webpackconfig.get())
    },

    'webpack-dev-server': {
      sampleapp: {
        webpack: merge({
          output: {
            library: 'backbrace',
            filename: '[name].js'
          }
        }, webpackconfig.get(true)),
        contentBase: [
          'packages/backbrace-sample-app'
        ],
        port: 8000
      },
      localdocs: {
        webpack: merge({
          output: {
            library: 'backbrace',
            filename: '[name].js'
          }
        }, webpackconfig.get(true)),
        contentBase: [
          'packages/backbrace-docs/src'
        ],
        port: 8000,
        historyApiFallback: true,
        watchContentBase: false,
        writeToDisk: true,
        before(app, server) {
          const chokidar = require("chokidar");
          const files = [
            '**/*.js',
            '**/*.json'
          ];
          const options = {
            // chokidar options can be found in it's docs
            followSymlinks: false,
            depth: 5, // opens chokidar's depth up just in case.
          }
          let watcher = chokidar.watch(files, options)
          watcher
            .on('all', _ => {
              server.sockWrite(server.sockets, 'content-changed');
            })
        }
      }
    },

    jsdoc: {
      dist: {
        src: [
          'packages/backbrace-core/src/*.js',
          'packages/backbrace-core/src/*/*.js',
          'packages/backbrace-core/src/*/*/*.js'
        ],
        options: {
          destination: 'packages/backbrace-docs/src/meta/data',
          config: 'jsdoc.conf.json',
          template: './node_modules/@backbrace/jsdoc-json',
          tutorials: 'packages/backbrace-docs/content'
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
          'packages/backbrace-core/src/route.js'
        ],
        options: {
          private: false,
          destination: './packages/backbrace-devkit/typings',
          template: 'node_modules/@backbrace/dts-generator/dist',
          config: './packages/backbrace-devkit/jsdoc.conf.json'
        }
      },
      tern: {
        src: [
          'packages/backbrace-core/src/*.js',
          'packages/backbrace-core/src/*/*.js',
          'packages/backbrace-core/src/*/*/*.js'
        ],
        options: {
          destination: './packages/backbrace-devkit/tern/defs',
          template: './node_modules/@backbrace/jsdoc-tern',
          config: 'jsdoc.conf.json',
          package: 'package.json'
        }
      },
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
    },

    copy: {
      docs: {
        files: [
          {
            expand: true, cwd: 'packages/backbrace-docs/src', src: ['**'], dest: paths.docs + 'dist', rename: function(dest, src) {
              return dest + '/' + src.replace('production.html', 'index.html');
            }
          },
          { expand: true, cwd: 'packages/backbrace-core/dist', src: ['**'], dest: paths.docs + 'dist/backbrace' }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('changelog', ['git_changelog:dist']);
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
  grunt.registerTask('generate', 'Generate docs and devkit', [
    'docs',
    'typings',
    'jsdoc:tern'
  ]);
  grunt.registerTask('build', [
    'webpack:prod'
  ]);
  grunt.registerTask('sampleapp', [
    'webpack-dev-server:sampleapp'
  ]);
  grunt.registerTask('localdocs', [
    'webpack-dev-server:localdocs'
  ]);
  grunt.registerTask('package', [
    'clean',
    'build',
    'generate',
    'copy:docs'
  ]);
  grunt.registerTask('default', ['package']);

};
