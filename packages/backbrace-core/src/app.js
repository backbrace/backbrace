/**
 * App module.
 * @module app
 * @private
 */

import './providers/icons';

import $ from 'jquery';
import { reset, promisequeue } from './promises';
import { error } from './error';
import { compile } from './jss';
import { error as logError } from './log';
import { settings } from './settings';
import { match as matchRoute } from './route';
import { isDefined, isHtml5 } from './util';
import { get as getAlert } from './providers/alert';
import { get as getWindow } from './providers/window';
import { RouteError } from './routeerror';
import { RouteErrorComponent } from './components/routeerror';

/** @type {AppComponent} */
let app = null;

let readyFunc = null,
    suppressNextError = false;

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
 * @param {Error|RouteError} err Error to display.
 * @returns {void}
 */
export function errorHandler(err) {

    const alert = getAlert();

    logError(err);

    // Run error handling.
    if (!suppressNextError) {

        // Clear the last error.
        if (app.currError) {
            app.currError.unload();
            app.currError = null;
        }

        reset();

        if (err instanceof RouteError) {
            app.currError = new RouteErrorComponent(err).load($('body'));
        } else {
            alert.error(err.message);
        }
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
 * Load external CSS.
 * @ignore
 * @returns {void}
 */
function loadCSS() {
    if (settings.style.css !== '')
        $(`<link rel="stylesheet" href="${settings.style.css}" >`)
            .appendTo($('head'));
}

/**
 * Load the app style with a loader script. After the style is loaded, the app colors will be loaded.
 * @ignore
 * @returns {JQueryPromise} Promises to return after loading the style.
 */
function loadStyle() {

    if (settings.style.loader !== '') {
        let def = $.Deferred();
        import(
            /* webpackChunkName: "style-[request]" */
            './styles/loaders/' + settings.style.loader).then(({ default: load }) => {
                load();
                loadColors();
                loadCSS();
                def.resolve();
            }).catch((err) => {
                errorHandler(err);
            });
        return def.promise();
    } else {
        loadColors();
        loadCSS();
    }
}

/**
 * Start the app.
 * @returns {void}
 */
export function start() {

    const window = getWindow();

    window.addEventListener('error', function(ev) {
        errorHandler(ev.error || ev);
    });

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

    // Check for HTML5.
    if (!isHtml5())
        throw appError('nohtml', 'This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Start ticking.
    window.setInterval(onTick, 10000);

    // JQuery wasn't loaded :(
    if ($ === null)
        throw appError('nojquery', 'JQuery was not loaded correctly');

    if ($.isFunction(window.document.getElementsByTagName('*')))
        throw appError('badbrowser', 'JQuery 3 is not supported in your browser');

    // Load the app component.
    import(
        /* webpackChunkName: "app" */
        './components/app').then(({ default: AppComponent }) => {

            promisequeue(

                () => loadStyle(),

                () => {

                    app = new AppComponent();
                    app.load($('body'));

                    if (!settings.windowMode) {

                        window.onpopstate = function(event) {
                            var r = matchRoute(window.location.pathname);
                            if (r) {
                                app.loadPage(r.page, {}, r.params);
                            }
                        };

                        let route = matchRoute(window.location.pathname);
                        if (route)
                            app.loadPage(route.page, {}, route.params);
                    }

                    if (readyFunc)
                        return readyFunc();
                }
            );

        }).catch((err) => {
            errorHandler(err);
        });

}

/**
 * Load a page.
 * @param {string} name Name of the page to load.
 * @param {viewerOptions} [options] Page viewer options.
 * @param {Object} [params] Page params.
 * @returns {void}
 */
export function loadPage(name, options = {}, params = {}) {
    app.loadPage(name, options, params);
}

/**
 * Close an opened page.
 * @param {number} id ID of the page to close.
 * @returns {void}
 */
export function closePage(id) {
    app.closePage(id);
}
