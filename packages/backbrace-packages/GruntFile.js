'use strict';

module.exports = function(grunt) {

    //Load grunt modules.
    require('load-grunt-tasks')(grunt);

    //Project configuration.
    grunt.initConfig({

        //Clean directories.
        clean: {
            dist: ['dist']
        },

        copy: {
            dist: {
                files: [
                    { expand: true, cwd: 'node_modules/@mdi/font', src: ['css/**', 'fonts/**', 'scss/**', '*.md'], dest: 'dist/materialdesignicons' },
                    { expand: true, cwd: 'node_modules/ace-builds/src', src: ['**'], dest: 'dist/ace/src' },
                    { expand: true, cwd: 'node_modules/ace-builds/src-min', src: ['**'], dest: 'dist/ace/min' },
                    { expand: true, cwd: 'src/ace', src: ['**'], dest: 'dist/ace' },
                    { expand: true, cwd: 'node_modules/jquery/dist', src: ['**'], dest: 'dist/jquery' },
                    { expand: true, cwd: 'node_modules/jquery-ripple', src: ['*.js', '*.css', '*.md'], dest: 'dist/jquery-ripple' },
                    { expand: true, cwd: 'node_modules/jquery-ui-dist', src: ['**'], dest: 'dist/jquery-ui' },
                    { expand: true, cwd: 'node_modules/moment', src: ['locale/**', 'moment.js', '*.md', 'LICENSE'], dest: 'dist/moment' },
                    { expand: true, cwd: 'node_modules/moment/min', src: ['moment.min.js'], dest: 'dist/moment' },
                    { expand: true, cwd: 'node_modules/reset-css', src: ['**'], dest: 'dist/resetcss' },
                    { expand: true, cwd: 'node_modules/roboto-fontface', src: ['**'], dest: 'dist/roboto' },
                    {
                        expand: true, cwd: 'node_modules/sweetalert/dist', src: ['**'], dest: 'dist/sweetalert', rename: function(dest, src) {
                            return dest + '/' + src.replace('-dev', '');
                        }
                    },
                    { expand: true, cwd: 'src/jqgrid', src: ['**'], dest: 'dist/jqgrid' }
                ]
            }
        }

    });

    grunt.registerTask('package', [
        'clean',
        'copy:dist'
    ]);

    grunt.registerTask('default', ['package']);

};
