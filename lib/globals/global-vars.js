// Global variables.
var versionInfo = require('../version-info/version-info.js');

module.exports = {
    __CDNSERVER__: JSON.stringify('https://cdn.backbrace.io/' + versionInfo.currentVersion.version)
}
