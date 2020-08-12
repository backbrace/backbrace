import $ from 'cash-dom';
import deepmerge from 'deepmerge';

import { error as err } from './error';
import { settings as appSettings } from './settings';
import { isDefined } from './util';

import { get as getErrorHandler } from './providers/error';
import * as windowprovider from './providers/window';
import { get as getStyleHandler, set as setStyleHandler } from './providers/style';

/**
 * @description
 * Backbrace public api.
 * @module Backbrace
 * @borrows module:app.app as app
 * @borrows module:app.message as message
 * @borrows module:app.ready as ready
 * @borrows module:app.serviceWorker as serviceWorker
 * @borrows module:app.start as start
 * @borrows module:app.unload as unload
 * @borrows module:globals~globals as globals
 * @borrows module:log.debug as logDebug
 * @borrows module:log.info as logInfo
 * @borrows module:log.error as logError
 * @borrows module:log.object as logObject
 * @borrows module:log.warning as logWarning
 * @borrows module:route.route as route
 * @borrows module:route.match as matchRoute
 * @borrows module:util.clipboard as clipboard
 * @borrows module:util.formatString as formatString
 * @borrows module:util.highlightSyntax as highlightSyntax
 * @borrows module:util.isDefined as isDefined
 * @borrows module:util.isError as isError
 * @borrows module:util.isMobileDevice as isMobileDevice
 * @borrows module:util.noop as noop
 * @borrows module:util.uid as uid
 */

// Leech onto the global error event.
window().addEventListener('error', function(ev) {
    const err = ev.error || ev;
    getErrorHandler().handleError(err);
});
window().addEventListener('unhandledrejection', function(ev) {
    const err = ev.reason;
    getErrorHandler().handleError(err);
});

/**
 * Get/Set the application settings.
 * @param {import('./types').settingsConfig} [newsettings] Settings to set.
 * @returns {import('./types').settingsConfig} Returns the app settings.
 * @example
 * // Turn on debug mode and don't minify the resources.
 * Backbrace.settings({
 *  debug: true,
 *  minify: false
 * });
 *
 * // Get the app name.
 * var name = Backbrace.settings().app.name;
 */
export function settings(newsettings) {
    if (isDefined(newsettings)) {
        let merged = deepmerge(appSettings, newsettings);
        Object.assign(appSettings, merged);
    }
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
 * Get/set the style handler.
 * @param {import('./providers/style').StyleHandler} [val] Set the window handler.
 * @returns {import('./providers/style').StyleHandler} Returns the style handler.
 */
export function style(val) {
    if (isDefined(val))
        setStyleHandler(val);
    return getStyleHandler();
}

/**
 * Access the DOM.
 * @param {*} selector DOM selector.
 * @param {*} [context] Selector context.
 * @returns {import('cash-dom').Cash}
 */
export function dom(selector, context) {
    return $(selector, context);
}

/**
 * Throw an application error.
 * @param {string} code Error code.
 * @param {string} msg Error message.
 * @returns {void}
 */
export function error(code, msg) {
    throw err('backbrace')(code, msg);
}

export {
    globals
} from './globals';

export {
    clipboard,
    formatString,
    isDefined,
    isError,
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
    route
} from './route';

export {
    serviceWorker,
    start,
    ready,
    message,
    unload,
    app
} from './app';

export {
    store
} from './store';

export {
    Component
} from './components/component';

export {
    ShadowComponent
} from './components/shadowcomponent';

export {
    Section as Section
} from './components/section';

export {
    Container as Container
} from './components/container';
