'use strict';

var path = require('path'),
  merge = require('webpack-merge'),
  moment = require('moment');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');
  grunt.loadNpmTasks('git-changelog');

  var webpackconfig = require('./webpack.config'),
    versionInfo = require('./lib/version-info/version-info.js'),
    paths = {
      core: 'packages/backbrace-core',
      devkit: 'packages/backbrace-devkit',
      docs: 'packages/backbrace-docs',
      sampleapp: 'packages/backbrace-sample-app'
    };

  //Project configuration.
  grunt.initConfig({

    //Clean directories.
    clean: {
      dist: [
        'dist',
        paths.core + '/dist',
        paths.schema + '/schema/icons.json',
        paths.schema + '/schema/pagedesign.json',
        paths.schema + '/schema/tabledesign.json',
        paths.schema + '/tern/defs/backbrace.json',
        paths.schema + '/typings',
        paths.docs + '/dist',
        paths.sampleapp + '/dist'
      ],
      tmp: ['tmp']
    },

    //Lint javascript.
    eslint: {
      all: {
        src: [
          paths.core + '/src/**/*.js',
          paths.core + '/test/**/*.js'
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
          path: path.join(__dirname, paths.core + '/dist'),
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
          paths.sampleapp + '/src'
        ],
        port: 8000,
        writeToDisk: true
      },
      localdocs: {
        webpack: merge({
          output: {
            library: 'backbrace',
            filename: '[name].js'
          }
        }, webpackconfig.get(true)),
        contentBase: [
          paths.docs + '/src'
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
          paths.core + '/src/*.js',
          paths.core + '/src/*/*.js',
          paths.core + '/src/*/*/*.js'
        ],
        options: {
          destination: paths.docs + '/src/design/data',
          config: 'jsdoc.conf.json',
          template: './node_modules/@backbrace/jsdoc-json',
          tutorials: paths.docs + '/content'
        }
      },
      typings: {
        src: [
          paths.core + '/src/types.js',
          paths.core + '/src/components/*.js',
          paths.core + '/src/components/*/*.js',
          paths.core + '/src/backbrace.js',
          paths.core + '/src/globals.js',
          paths.core + '/src/app.js',
          paths.core + '/src/promises.js',
          paths.core + '/src/module.js',
          paths.core + '/src/log.js',
          paths.core + '/src/util.js',
          paths.core + '/src/http.js',
          paths.core + '/src/route.js'
        ],
        options: {
          private: true,
          destination: paths.devkit + '/typings',
          template: 'node_modules/@backbrace/dts-generator/dist',
          config: paths.devkit + '/jsdoc.conf.json'
        }
      },
      tern: {
        src: [
          paths.core + '/src/*.js',
          paths.core + '/src/*/*.js',
          paths.core + '/src/*/*/*.js'
        ],
        options: {
          destination: paths.devkit + '/tern/defs',
          template: './node_modules/@backbrace/jsdoc-tern',
          config: 'jsdoc.conf.json',
          package: 'package.json'
        }
      },
      schema: {
        src: [
          paths.core + '/src/types.js'
        ],
        options: {
          destination: paths.devkit + '/schema',
          template: './scripts/schema',
          config: 'jsdoc.conf.json'
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
          input: paths.devkit + '/typings/types.d.ts',
          output: paths.devkit + '/typings/types.d.ts'
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
          logo: versionInfo.previousVersions.slice(-2).shift(),
          tag: versionInfo.previousVersions.slice(-2).shift(),
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
      sampleapp: {
        files: [
          {
            expand: true, cwd: paths.sampleapp + '/src', src: ['**'], dest: paths.sampleapp + '/dist', rename: function(dest, src) {
              return dest + '/' + src.replace('production.html', 'index.html');
            }
          },
          { expand: true, cwd: paths.core + '/dist', src: ['**'], dest: paths.sampleapp + '/dist/backbrace' }
        ]
      },
      docs: {
        files: [
          {
            expand: true, cwd: paths.docs + '/src', src: ['**'], dest: paths.docs + '/dist', rename: function(dest, src) {
              return dest + '/' + src.replace('production.html', 'index.html');
            }
          },
          { expand: true, cwd: paths.core + '/dist', src: ['**'], dest: paths.docs + '/dist/backbrace' }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('changelog', ['git_changelog:dist']);
  grunt.registerTask('test', 'Run the unit tests with Karma', [
    'eslint',
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
    'jsdoc:tern',
    'jsdoc:schema'
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
    'generate',
    'build',
    'copy:sampleapp',
    'copy:docs'
  ]);
  grunt.registerTask('default', ['package']);

};
