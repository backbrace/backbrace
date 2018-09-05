'use strict';

module.exports = function(grunt) {

    //Load grunt modules.
    require('load-grunt-tasks')(grunt);

    //Project configuration.
    grunt.initConfig({

        //Clean directories.
        clean: {
            dist: ['packages']
        },

        copy: {
            packages: {
                files: [
                    { expand: true, cwd: 'node_modules/@mdi/font', src: ['css/**', 'fonts/**', 'scss/**', '*.md'], dest: 'packages/materialdesignicons' },
                    { expand: true, cwd: 'node_modules/jquery/dist', src: ['**'], dest: 'packages/jquery' },
                    { expand: true, cwd: 'node_modules/jquery-ripple', src: ['*.js', '*.css', '*.md'], dest: 'packages/jquery-ripple' },
                    { expand: true, cwd: 'node_modules/jquery-ui-dist', src: ['**'], dest: 'packages/jquery-ui' },
                    { expand: true, cwd: 'node_modules/moment', src: ['locale/**', 'moment.js', '*.md', 'LICENSE'], dest: 'packages/moment' },
                    { expand: true, cwd: 'node_modules/moment/min', src: ['moment.min.js'], dest: 'packages/moment' },
                    { expand: true, cwd: 'node_modules/reset-css', src: ['**'], dest: 'packages/resetcss' },
                    {
                        expand: true, cwd: 'node_modules/sweetalert/dist', src: ['**'], dest: 'packages/sweetalert', rename: function(dest, src) {
                            return dest + '/' + src.replace('-dev', '');
                        }
                    },
                    { expand: true, cwd: 'src/jqgrid', src: ['**'], dest: 'packages/jqgrid' }
                ]
            }
        }

    });

    grunt.registerTask('package', [
        'clean',
        'copy:packages'
    ]);

    grunt.registerTask('default', ['package']);

};
