'use strict';

module.exports = function(grunt) {

  //Load grunt modules.
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('lib/grunt');

  var pkg = require('./package.json');

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
      dev: require('./dev.config.js'),
      prod: require('./prod.config.js')
    },

    'webpack-dev-server': {
      core: {
        webpack: require('./dev.config.js'),
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
          config: 'jsdoc.conf.json'
        }
      }
    },

    file_append: {
      typings: {
        files: [
          {
            prepend: "/**\n" +
              "* Type definitions for " + pkg.name + "\n" +
              "* Project: " + pkg.repository.url + "\n" +
              "* Definitions by: tsd-doc\n" +
              "*/\n\n",
            input: './typings/types.d.ts',
            output: './typings/types.d.ts'
          }
        ]
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
    //'webpack:prod', Add this back in when they add support for extends
    'docs',
    'typings'
  ]);
  grunt.registerTask('default', ['package']);

};
