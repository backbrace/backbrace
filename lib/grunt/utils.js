'use strict';

var grunt = require('grunt');
var spawn = require('npm-run').spawn;
var fs = require('fs');

module.exports = {

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
    },

    fileToString: function(path) {
        return fs.readFileSync(path, 'utf8');
    }
};
