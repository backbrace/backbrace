// Global variables.
var versionInfo = require('./package-info.js');

exports.get = function(devmode) {
    return {
        DEVMODE: devmode || false,
        FULLVERSION: JSON.stringify(versionInfo.currentVersion.full),
        'process.browser': 'true'
    };
};
