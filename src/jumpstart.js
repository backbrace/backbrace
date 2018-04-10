'use strict';

var $app = require('./app'),
    $log = require('./log'),
    $settings = require('./settings'),
    $util = require('./util'),
    $window = require('./providers/window');

/**
 * @typedef VersionInfo
 * @property {string} full Full version number. eg: 0.1.0
 */

/**
 * App configuration.
 * @typedef AppConfig
 * @property {string} name App name (displays in header if there is no logo image). Defaults to `Jumpstart App`.
 * @property {string} version App version. Defaults to `0.1.0`.
 * @property {string} title App tite (displays in browser window). Defaults to `New Jumpstart App`.
 * @property {string} description App description. Defaults to `Web App powered by Jumpstart`.
 */

/**
 * Meta data configuration.
 * @typedef MetaConfig
 * @property {string} dir Meta data root directory. Defaults to `./meta`.
 */

/**
 * Loader style.
 * @typedef LoaderStyle
 * @property {string} zindex Loader bar z-index. Defaults to `1000`.
 * @property {string} barheight Loader bar height. Defaults to `10px`.
 * @property {string} barwidth Loader bar width. Defaults to `800px`.
 * @property {string} progressbackground Progress bar background. Defaults to `#A2CFEE`.
 * @property {string} progresscolor Progress bar foreground color. Defaults to `#3498DB`.
 * @property {string} blockerbackground Background for loader blocker. Defaults to `#ECF0F1`.
 */

/**
 * Font style.
 * @typedef FontStyle
 * @property {string} url URL for the font. Defaults to Roboto font.
 * @property {string} family Font family to use for the app. Defaults to `'Roboto', sans-serif`.
 */

/**
 * Images style.
 * @typedef ImagesStyle
 * @property {string} logo URL for the logo image (displayed in the header).
 * @property {string} menuLogo URL for the menu logo image (displayed at the top of the main menu).
 * @property {string} blocker URL for the blocker image (displayed while the loader is shown).
 */

/**
 * Colours style.
 * @typedef ColorsStyle
 * @property {string} header Header background color. Defaults to `#3498db`.
 * @property {string} headertext Header foreground color. Defaults to `#FFF`.
 * @property {string} headerborder Header border style. Defaults to `none`.
 * @property {string} title Window title background color. Defaults to `#FFF`.
 * @property {string} titletext Window title foreground color. Defaults to `#000`.
 * @property {string} menuicon Menu icon color. Defaults to `#FFF`.
 * @property {string} default Window background color. Defaults to `#FFF`.
 * @property {string} defaulttext Window foreground color. Defaults to `#000`.
 * @property {string} hover Hover background color. Defaults to `whitesmoke`.
 * @property {string} hovertext Hover foreground color. Defaults to `#000`.
 * @property {string} alertbutton Alert button background color. Defaults to `#3498db`.
 * @property {string} alertbuttontext Alert button foreground color. Defaults to `#FFF`.
 */

/**
 * App style configuration. Merged with the JSS style at run time.
 *
 * Example: The place holder `%colors:header%` will merge with the settings.style.colors.header value.
 * @typedef StyleConfig
 * @property {LoaderStyle} loader Loader style.
 * @property {FontStyle} font Font style.
 * @property {ImagesStyle} images Images style.
 * @property {ColorsStyle} colors Colors style.
 */

/**
 * Application settings.
 * @typedef Settings
 * @property {VersionInfo} VERSION_INFO Version info for Jumpstart.
 * @property {boolean} debug Set the app to debug mode. Defaults to `false`.
 * @property {boolean} minify Load minified packages. Defaults to `true`.
 * @property {boolean} mobile Mobile mode flag.
 * @property {boolean} guiAllowed GUI allowed flag.
 * @property {boolean} autoSwitch Auto switch to mobile mode if detected. Defaults to `true`.
 * @property {object} jss JSS style to use. Defaults to the flat JSS style.
 * @property {boolean} windowMode Allow the use of multiple windows. Defaults tp `true`.
 * @property {AppConfig} app App config.
 * @property {MetaConfig} meta Meta data config.
 * @property {StyleConfig} style Style config.
 */

/**
 * @module Jumpstart
 */
window['Jumpstart'] = {

    /**
     * Get/Set the application settings.
     * @memberof module:Jumpstart
     * @param {Settings} [settings] Settings to set.
     * @returns {Settings} Returns the app settings.
     */
    settings: function(settings) {
        $util.extend($settings, settings);
        return $settings;
    },

    // Log module.
    logInfo: $log.info,
    logWarning: $log.warning,
    logError: $log.error,
    logDebug: $log.debug,
    logObject: $log.object,

    // App module.
    start: $app.start,

    // Window provider.
    setWindow: function(val) {
        $window.set(val);
    }

};
