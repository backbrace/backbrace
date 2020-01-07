/**
 * App module.
 * @module app
 * @private
 */

import './providers/icons';

import $ from 'jquery';
import { error } from './error';
import { compile } from './jss';
import { error as logError } from './log';
import { settings } from './settings';
import { match as matchRoute, processLinks } from './route';
import { isDefined, checkBrowser } from './util';
import { get as getAlert } from './providers/alert';
import { get as getWindow } from './providers/window';

/** @type {AppComponent} */
let app = null;

let readyFunc = null,
    suppressNextError = false,
    styleLoader = null,
    appInit = false;

const appError = error('app');

/**
 * @ignore
 * @type {ServiceWorkerRegistration}
 */
let serviceWorkerRegistration = null;

/**
 * Get/set the service worker.
 * @param {ServiceWorkerRegistration} val If `defined`, sets the service worker.
 * @returns {void|ServiceWorkerRegistration} If `val` is `undefined`, returns the current service worker registration.
 */
export function serviceWorker(val) {
    if (isDefined(val)) {
        serviceWorkerRegistration = val;
    } else {
        return serviceWorkerRegistration;
    }
}

/**
 * On tick function.
 * @ignore
 * @returns {void}
 */
function onTick() {
    if (serviceWorkerRegistration)
        serviceWorkerRegistration.update();
}

/**
 * Show a message dialog.
 * @param {string} msg Message to display.
 * @param {function():void} [callbackFn] Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Message"] Title of the dialog.
 * @returns {void}
 */
export function message(msg, callbackFn, title) {

    const alert = getAlert();

    // If there is no gui, just run the callback.
    if (!settings.guiAllowed) {
        if (callbackFn)
            callbackFn();
        return;
    }

    title = title || 'Application Message';

    alert.message(msg, callbackFn, title);
}

/**
 * Show a confirmation dialog.
 * @param {string} msg Message to display.
 * @param {function(boolean):void} callbackFn Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Confirmation"] Title of the dialog.
 * @param {string} [yescaption="OK"] Caption of the "yes" button.
 * @param {string} [nocaption="Cancel"] Caption of the "no" button.
 * @returns {void}
 */
export function confirm(msg, callbackFn, title, yescaption, nocaption) {

    const alert = getAlert();

    // If there is no gui, just run the callback.
    if (!settings.guiAllowed) {
        if (callbackFn)
            callbackFn(null);
        return;
    }

    title = title || 'Application Confirmation';

    // Fire the event.
    alert.confirm(msg, callbackFn, title, yescaption, nocaption);
}

/**
 * Display an error and kill the current execution.
 * @param {Error} err Error to display.
 * @returns {void}
 */
export function errorHandler(err) {

    const alert = getAlert();

    // Hide the placeholder.
    $('.placeholder-content').remove();

    logError(err);

    // Run error handling.
    if (!suppressNextError) {
        alert.error(err.message);
    }

    suppressNextError = false;
}

/**
 * Execute a function after the app is loaded.
 * @param {Function} func Function to execute.
 * @returns {void}
 */
export function ready(func) {
    readyFunc = func;
}

/**
 * Load the app colors from the settings into a new style tag.
 * @ignore
 * @returns {void}
 */
function loadColors() {

    let jss = {},
        selectors = ['', ':hover', ':active', ':focus'];

    // Loop through the colors and add classes.
    $.each(settings.style.colors, function(/** @type {string} */classname, color) {
        selectors.forEach(function(sel) {
            let csssel = `${sel.replace(':', '-')}${sel}`;
            if (classname.startsWith('text')) {
                jss[`.text-${classname.substr(4)}${csssel}`] = {
                    color: color
                };
            } else if (classname.startsWith('bg')) {
                jss[`.bg-${classname.substr(2)}${csssel}`] = {
                    'background-color': color
                };
                jss[`.border-${classname.substr(2)}${csssel}`] = {
                    'border-color': color
                };
            }
        });
    });

    //Compile the jss.
    let css = compile(jss);
    $('<style id="appcolors">')
        .append(css)
        .appendTo($('head'));
}

/**
 * Load the app style with a loader script. After the style is loaded, the app colors will be loaded.
 * @ignore
 * @async
 * @returns {Promise} Returns after loading the style.
 */
async function loadStyle() {

    if (settings.style.loader) {

        const loader = await import(
            /* webpackChunkName: "style-[request]" */
            './styles/loaders/' + settings.style.loader);

        styleLoader = loader;
        loader.load();
    }

    loadColors();

    if (settings.style.css)
        $(`<link id="appcss" rel="stylesheet" href="${settings.style.css}" >`)
            .appendTo($('head'));
}

/**
 * Start the app.
 * @async
 * @returns {Promise} Returns after the app is started.
 */
export async function start() {

    try {

        if (!appInit) {

            const window = getWindow();

            $('<meta>').attr({
                'name': 'Description',
                'content': settings.app.description
            }).appendTo(window.document.head);

            $('<meta>').attr({
                'http-equiv': 'X-UA-Compatible',
                'content': 'IE=Edge'
            }).appendTo(window.document.head);

            $('<meta>').attr({
                'name': 'viewport',
                'content': 'width=device-width, initial-scale=1, maximum-scale=2, minimal-ui'
            }).appendTo(window.document.head);

            $('<meta>').attr({
                'name': 'apple-mobile-web-app-capable',
                'content': 'yes'
            }).appendTo(window.document.head);

            $('<meta>').attr({
                'name': 'mobile-web-app-capable',
                'content': 'yes'
            }).appendTo(window.document.head);

            // Update title.
            window.document.title = settings.app.title;

            // Check the browser.
            if (!checkBrowser())
                throw appError('badbrowser', `Your browser is not supported by this app. Please update or use a different browser.
                <p><small>We recommend chrome: <a href="https://www.google.com/chrome/" target="new">click here</a></p></small>`);

            // Start ticking.
            window.setInterval(onTick, 10000);

            if ($.isFunction(window.document.getElementsByTagName('*')))
                throw appError('badbrowser', 'JQuery 3 is not supported in your browser');

        }

        // Import the app component.
        const { default: AppComponent } = await import(
            /* webpackChunkName: "app" */
            './components/app');

        await loadStyle();

        // Load the app component.
        app = new AppComponent();
        app.load($('body'));

        app.afterUpdate = () => {
            processLinks();
            if (styleLoader && styleLoader.afterUpdate)
                styleLoader.afterUpdate();
        };

        if (readyFunc)
            await readyFunc();

        if (!settings.windowMode) {

            window.onpopstate = async () => {
                var r = matchRoute(window.location.pathname);
                if (r) {
                    await loadPage(r.page, {}, r.params);
                }
            };

            let route = matchRoute(window.location.pathname);
            if (route)
                await loadPage(route.page, {}, route.params);
        }

    } catch (err) {
        errorHandler(err);
    }

}

/**
 * Unload the app.
 * @returns {void}
 */
export function unload() {

    if (app)
        app.unload();

    readyFunc = null;
    suppressNextError = false;
    styleLoader = null;

    $('#appcolors,#appcss').remove();
}

/**
 * Load a page.
 * @async
 * @param {string} name Name of the page to load.
 * @param {viewerOptions} [options] Page viewer options.
 * @param {Object} [params] Page params.
 * @returns {Promise} Returns after loading the page.
 */
export async function loadPage(name, options = {}, params = {}) {
    try {
        await app.loadPage(name, options, params);
    } catch (err) {
        errorHandler(err);
    }
}

/**
 * Close an opened page.
 * @param {number} id ID of the page to close.
 * @returns {void}
 */
export function closePage(id) {
    app.closePage(id);
}

/**
 * Get the current page.
 * @returns {ViewerComponent} Returns the current page.
 */
export function currentPage() {
    return app.currentPage();
}
