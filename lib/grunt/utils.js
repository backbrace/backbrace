'use strict';

var grunt = require('grunt');
var spawn = require('npm-run').spawn;

module.exports = {

    //Wrap source code with a prefix/suffix.
    wrap: function(src, name) {
        src.unshift('src/' + name + '.prefix');
        src.push('src/' + name + '.suffix');
        return src;
    },

    //Remove multiple use stricts.
    singleStrict: function(src, insert) {
        return src
        .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
        .replace(/(\(function\([^)]*\)\s*\{)/, '$1\'use strict\';'); // add single strict mode flag
    },

    //Process build info.
    process: function(src, JS_VERSION, strict) {
        var processed = src
            .replace(/(['"])JS_VERSION_FULL\1/g, JS_VERSION.full);
        if (strict !== false) processed = this.singleStrict(processed, '\n\n', true);
        return processed;
    },

    //Build script files.
    build: function(config, fn) {

        var files = grunt.file.expand(config.src);

        //Join the files.
        var src = files.map(function(filepath) {
            return grunt.file.read(filepath);
        }).join(grunt.util.normalizelf('\n'));

        //Process the build info.
        var processed = this.process(src, grunt.config('JS_VERSION'), config.stict);

        //Write the file.
        grunt.file.write(config.dest, processed);
        grunt.log.ok('File ' + config.dest + ' created.');
        fn();
    },

    startKarma: function(config, singleRun, done) {
        var browsers = grunt.option('browsers');
        var reporters = grunt.option('reporters');
        var noColor = grunt.option('no-colors');
        var port = grunt.option('port');
        var p = spawn('karma', ['start', config,
            singleRun ? '--single-run=true' : '',
            reporters ? '--reporters=' + reporters : '',
            browsers ? '--browsers=' + browsers : '',
            noColor ? '--no-colors' : '',
            port ? '--port=' + port : ''
        ]);
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
        p.on('exit', function(code) {
            if (code !== 0) grunt.fail.warn('Karma test(s) failed. Exit code: ' + code);
            done();
        });
    }
};
