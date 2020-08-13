'use strict';

var path = require('path'),
  merge = require('webpack-merge'),
  clean = require('./tools/grunt-tasks/grunt-clean'),
  eslint = require('./tools/grunt-tasks/grunt-eslint'),
  karmaConfig = require('./tools/grunt-tasks/grunt-karma'),
  ts = require('./tools/grunt-tasks/grunt-ts');

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tools/karma');

  var webpackconfig = require('./webpack.base'),
    versionInfo = require('./tools/utils/package-info'),
    paths = require('./tools/utils/packages');

  //Project configuration.
  grunt.initConfig({

    clean: clean,
    eslint: eslint,
    karma: karmaConfig.karma,
    'karma-auto': karmaConfig.auto,
    ts: ts,

    webpack: {
      prod: merge({
        output: {
          path: path.join(__dirname, paths.core + '/dist')
        }
      }, webpackconfig.get())
    },

    'webpack-dev-server': {
      localdocs: {
        webpack: merge({
          output: {
            path: path.join(__dirname, paths.docs + '/src/node_modules/@backbrace/core/dist'),
            publicPath: 'node_modules/@backbrace/core/dist/'
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
          config: paths.core + '/jsdoc.conf.json',
          template: './jsdoc/json',
          tutorials: paths.docs + '/content'
        }
      },
      typings: {
        src: [
          paths.core + '/src/types.js',
          paths.core + '/src/services/*.js',
          paths.core + '/src/components/*.js',
          paths.core + '/src/components/*/*.js',
          paths.core + '/src/errors/*.js',
          paths.core + '/src/providers/*.js',
          paths.core + '/src/backbrace.js',
          paths.core + '/src/globals.js',
          paths.core + '/src/app.js',
          paths.core + '/src/log.js',
          paths.core + '/src/util.js',
          paths.core + '/src/route.js',
          paths.core + '/src/data.js',
          paths.core + '/src/state.js'
        ],
        options: {
          private: true,
          destination: paths.devkit + '/typings',
          template: './jsdoc/dts',
          config: paths.devkit + '/jsdoc.conf.json'
        }
      },
      schema: {
        src: [
          paths.core + '/src/types.js'
        ],
        options: {
          destination: paths.devkit + '/schema',
          template: './jsdoc/schema',
          config: paths.core + '/jsdoc.conf.json'
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
            "*/\n\n" +
            "import { Cash, Selector } from './cash';\n" +
            "\n",
          input: paths.devkit + '/typings/types.d.ts',
          output: paths.devkit + '/typings/types.d.ts'
        }]
      }
    },

    copy: {
      dev: {
        files: [
          { expand: true, cwd: paths.core + '/dist', src: ['**'], dest: paths.docs + '/src/node_modules/@backbrace/core/dist' },
          { expand: true, cwd: './node_modules/prismjs', src: ['**'], dest: paths.docs + '/src/node_modules/prismjs' }
        ]
      },
      dist: {
        files: [
          { expand: true, cwd: paths.docs + '/src', src: ['**'], dest: paths.docs + '/dist' },
          { expand: true, cwd: paths.core + '/dist', src: ['**'], dest: paths.docs + '/dist/node_modules/@backbrace/core/dist' },
          { src: paths.core + '/dist/service-worker.js', dest: paths.docs + '/dist/service-worker.js' },
          { expand: true, cwd: './node_modules/prismjs', src: ['**'], dest: paths.docs + '/dist/node_modules/prismjs' }
        ]
      },
      typings: {
        files: [
          { expand: true, cwd: paths.devkit + '/typings', src: ['**'], dest: paths.docs + '/src/node_modules/@backbrace/core/dist/typings' }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('test', 'Run the unit tests with Karma', [
    'eslint',
    'package',
    'ts',
    'karma:core'
  ]);
  grunt.registerTask('autotest', [
    'karma-auto:core'
  ]);
  grunt.registerTask('docs', [
    'jsdoc:dist'
  ]);
  grunt.registerTask('typings', [
    'jsdoc:typings',
    'file_append:typings'
  ]);
  grunt.registerTask('generate', 'Generate docs and devkit', [
    'docs',
    'typings',
    'jsdoc:schema',
    'copy:typings',
  ]);
  grunt.registerTask('build', [
    'webpack:prod'
  ]);
  grunt.registerTask('localdocs', [
    'copy:dev',
    'webpack-dev-server:localdocs'
  ]);
  grunt.registerTask('package', [
    'clean',
    'generate',
    'build',
    'copy:dev',
    'copy:dist'
  ]);
  grunt.registerTask('default', ['package']);

};
