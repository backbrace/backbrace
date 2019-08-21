/**
 * @description
 * Backbrace public api.
 * @module backbrace
 * @borrows module:app.loadPage as loadPage
 * @borrows module:app.message as message
 * @borrows module:app.ready as ready
 * @borrows module:app.serviceWorker as serviceWorker
 * @borrows module:app.start as start
 * @borrows module:globals~globals as globals
 * @borrows module:http.get as get
 * @borrows module:http.post as post
 * @borrows module:log.debug as logDebug
 * @borrows module:log.info as logInfo
 * @borrows module:log.error as logError
 * @borrows module:log.object as logObject
 * @borrows module:log.warning as logWarning
 * @borrows module:module.controller as controller
 * @borrows module:promises.promiseblock as promiseblock
 * @borrows module:promises.promiseinsert as promiseinsert
 * @borrows module:promises.promisequeue as promisequeue
 * @borrows module:promises.promiseeach as promiseeach
 * @borrows module:route.route as route
 * @borrows module:route.match as matchRoute
 * @borrows module:util.clipboard as clipboard
 * @borrows module:util.findInput as findInput
 * @borrows module:util.formatString as formatString
 * @borrows module:util.highlightSyntax as highlightSyntax
 * @borrows module:util.isDefined as isDefined
 * @borrows module:util.isError as isError
 * @borrows module:util.isHtml5 as isHtml5
 * @borrows module:util.isMobileDevice as isMobileDevice
 * @borrows module:util.noop as noop
 * @borrows module:util.uid as uid
 */

import $ from 'jquery';
import { settings as appSettings } from './settings';
import { isDefined } from './util';
import * as windowprovider from './providers/window';
import { error as err } from './error';
import { RouteError } from './routeerror';

/**
 * Get/Set the application settings.
 * @param {settingsConfig} [newsettings] Settings to set.
 * @returns {settingsConfig} Returns the app settings.
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
 * Set the public path.
 * @param {string} path Public path to set.
 * @returns {void}
 */
export function publicPath(path) {
    // @ts-ignore
    // eslint-disable-next-line camelcase,no-undef
    __webpack_public_path__ = path;
}

/**
 * Get/set the window provider.
 * @param {(Window|Object)} [val] Window instance to set.
 * @returns {Window} Returns the window instance.
 */
export function window(val) {
    if (isDefined(val))
        windowprovider.set(val);
    return windowprovider.get();
}

/**
 * Get the JQuery library.
 * @returns {JQueryStatic} Returns the JQuery library.
 */
export function jquery() {
    return $;
}

/**
 * Throw an application error.
 * @param {string} code Error code.
 * @param {string} msg Error message.
 * @param  {...any} [args] Arguments to merge into the message.
 * @returns {void}
 */
export function error(code, msg, ...args) {
    throw err('backbrace')(code, msg, args);
}

/**
 * Throw a route error.
 * @param {string} code Error code.
 * @param {string} msg Error message.
 * @param  {...any} [args] Arguments to merge into the message.
 * @returns {void}
 */
export function routeError(code, msg, ...args) {
    throw err('route', RouteError)(code, msg, args);
}

export {
    globals
} from './globals';

export {
    clipboard,
    findInput,
    formatString,
    highlightSyntax,
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
