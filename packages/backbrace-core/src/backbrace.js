/**
 * @description
 * Backbrace public api.
 * @module backbrace
 */

import $ from 'jquery';
import { settings as appSettings } from './settings';
import { isDefined } from './util';
import * as windowprovider from './providers/window';

/**
 * Get/Set the application settings.
 * @method settings
 * @memberof module:backbrace
 * @param {Settings} [newsettings] Settings to set.
 * @returns {Settings} Returns the app settings.
 * @example
 * // Turn on debug mode and don't minify the resources.
 * backbrace.settings({
 *  debug: true,
 *  minify: false
 * });
 *
 * // Get the app name.
 * var name = backbrace.settings().app.name;
 */
export function settings(newsettings) {
    if (isDefined(newsettings))
        $.extend(true, appSettings, newsettings);
    return appSettings;
}

/**
 * Get/set the window provider.
 * @method window
 * @memberof module:backbrace
 * @param {(Window|object)} [val] Window instance to set.
 * @returns {(Window|object)} Returns the window instance.
 */
export function window(val) {
    if (isDefined(val))
        windowprovider.set(val);
    return windowprovider.get();
}

/**
 * Get an app style.
 * @param {string} name Name of the style.
 * @returns {object} Returns the application style.
 */
export function style(name) {
    let s = require('./styles/' + name + '.js');
    return s.style;
}

export {
    set as setStyle
} from './providers/style';

/**
 * Get the JQuery library.
 * @returns {JQueryStatic} Returns the JQuery library.
 */
export function jquery() {
    return $;
}

export {
    globals
} from './globals';

export {
    findInput,
    formatString,
    isDefined,
    isError,
    isHtml5,
    isMobileDevice,
    noop,
    uid
} from './util';

export {
    info as logInfo,
    warning as logWarning,
    error as logError,
    debug as logDebug,
    object as logObject
} from './log';

export {
    promiseblock,
    promiseinsert,
    promisequeue,
    promiseeach
} from './promises';

export {
    controller
} from './module';

export {
    route
} from './route';

export {
    serviceWorker,
    start,
    ready,
    loadPage,
    message
} from './app';

export {
    get,
    post
} from './http';

export {
    filter as sanitizeString
} from './sanitize';
