var grunt = require('grunt'),
    spawn = require('npm-run').spawn;

function startKarma(config, singleRun, done) {
    var browsers = grunt.option('browsers'),
        reporters = grunt.option('reporters'),
        noColor = grunt.option('no-colors'),
        port = grunt.option('port'),
        p = spawn('karma', ['start', config,
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

module.exports = function(grunt) {

    grunt.registerMultiTask('karma', 'run tests using karma', function() {
        startKarma(this.data, true, this.async());
    });

    grunt.registerMultiTask('karma-auto', 'run and watch the unit tests with Karma', function() {
        startKarma(this.data, false, this.async());
    });

};
