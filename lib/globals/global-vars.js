// Global variables.
var versionInfo = require('../version-info/version-info.js');

exports.get = function(devmode) {
    return {
        __CDNSERVER__: JSON.stringify('https://cdn.backbrace.io/' + versionInfo.currentVersion.version),
        __DEVMODE__: devmode || false
    };
}
