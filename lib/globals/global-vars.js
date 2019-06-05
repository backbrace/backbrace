// Global variables.
var versionInfo = require('../version-info/version-info.js');

exports.get = function(devmode) {
    return {
        CDNSERVER: JSON.stringify('https://cdn.backbrace.io/' + versionInfo.currentVersion.version),
        DEVMODE: devmode || false,
        FULLVERSION: JSON.stringify(versionInfo.currentVersion.full)
    };
}
