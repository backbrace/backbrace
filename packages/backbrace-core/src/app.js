/**
 * App module.
 * @module app
 * @private
 */

import { promisequeue, reset } from './promises';
import { error } from './error';
import { compile } from './jss';
import { error as logError } from './log';
import * as packagemanager from './packagemanager';
import * as progress from './progress';
import { settings } from './settings';
import * as sweetalert from './sweetalert';
import {
    setZeroTimeout,
    addElement,
    isDefined,
    isHtml5,
    isMobileDevice
} from './util';
import { get as getAlert, set as setAlert } from './providers/alert';
import { get as getIcons } from './providers/icons';
import { get as getJQuery } from './providers/jquery';
import { get as getWindow } from './providers/window';
import { HeaderComponent } from './components/header';
import { ViewerComponent } from './components/viewer';

let maincontainer = null,
    windows = null,
    activePage = 0,
    readyFunc = null,
    suppressNextError = false;

/**
 * @ignore
 * @description
 * App pages that are currently loaded.
 * @type {Map<number,ViewerComponent>}
 */
let pages = new Map();

const appError = error('app');

/**
 * @ignore
 * @type {ServiceWorkerRegistration}
 */
let serviceWorkerRegistration = null;

/**
 * Get/set the service worker.
 * @method serviceWorker
 * @memberof module:backbrace
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
 * @method message
 * @memberof module:backbrace
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
            setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Message';

    alert.message(msg, callbackFn, title);
}

/**
 * Show a confirmation dialog.
 * @ignore
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
            setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Confirmation';

    // Fire the event.
    alert.confirm(msg, callbackFn, title, yescaption, nocaption);
}

/**
 * Display an error and kill the current execution.
 * @ignore
 * @param {Error} err Error to display.
 * @returns {void}
 */
export function errorHandler(err) {

    const alert = getAlert();

    progress.hide();

    logError(err);

    // Run error handling.
    if (!suppressNextError) {
        reset();
        alert.error(err.message);
    }

    suppressNextError = false;
}

/**
 * Execute a function after the app is loaded.
 * @method ready
 * @memberof module:backbrace
 * @param {Function} func Function to execute.
 * @returns {void}
 */
export function ready(func) {
    readyFunc = func;
}

/**
 * Start the app.
 * @method start
 * @memberof module:backbrace
 * @returns {void}
 */
export function start() {

    const window = getWindow();

    window.addEventListener('error', function(ev) {
        errorHandler(ev.error || ev);
    });

    // Add font css.
    addElement('link', {
        'href': settings.style.font.url,
        'rel': 'stylesheet'
    }, window.document.head);

    addElement('meta', {
        'name': 'Description',
        'content': settings.app.description
    }, window.document.head);

    addElement('meta', {
        'http-equiv': 'X-UA-Compatible',
        'content': 'IE=Edge'
    }, window.document.head);

    addElement('meta', {
        'name': 'viewport',
        'content': 'width=device-width, initial-scale=1, maximum-scale=2, minimal-ui'
    }, window.document.head);

    addElement('meta', {
        'name': 'apple-mobile-web-app-capable',
        'content': 'yes'
    }, window.document.head);

    addElement('meta', {
        'name': 'mobile-web-app-capable',
        'content': 'yes'
    }, window.document.head);

    progress.show();

    // Update title.
    window.document.title = settings.app.title;

    // Check for HTML5.
    if (!isHtml5())
        throw appError('nohtml', 'This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Start ticking.
    window.setInterval(onTick, 10000);

    // Load JQuery.
    packagemanager.loadScript('jquery', function() {

        // JQuery wasn't loaded :(
        const $ = getJQuery();
        if ($ === null)
            throw appError('nojquery', 'JQuery was not loaded correctly');

        if ($.isFunction(window.document.getElementsByTagName('*')))
            throw appError('badbrowser', 'JQuery 3 is not supported in your browser');

        // Load startup packages.
        promisequeue(function() {

            packagemanager.add('resetcss');
            packagemanager.add('jquery-ui', 1);
            packagemanager.add('materialdesignicons', 2);
            packagemanager.add('moment', 2);
            packagemanager.add('sweetalert', 2);
            packagemanager.add('jquery-ripple', 3);
            packagemanager.load(function() {

                progress.hide();

                // Compile JSS and load into a style tag.
                const css = compile(settings.jss);
                $('<style id="appstyle">')
                    .append(css)
                    .appendTo($('head'));

                // Lets upgrade alerts...
                setAlert({
                    message: sweetalert.show,
                    confirm: function(msg, callback, title, yescaption, nocaption) {
                        sweetalert.show(msg, function() {
                            callback(true);
                        });
                    },
                    error: function(msg) {
                        sweetalert.show(msg, null, 'Application Error');
                    }
                });

                load($('body'));

                if (readyFunc)
                    return readyFunc();

            });
        });

    });

}

/**
 * Load the app into a container.
 * @private
 * @param {JQuery} container JQuery element to load the app into.
 * @returns {void}
 */
export function load(container) {

    const $ = getJQuery();


    let main = $('<div class="main"></div>').appendTo(container);

    $('body').addClass(isMobileDevice() ? 'mobile-app' : 'desktop-app');

    if (!isMobileDevice()) {

        // Add window toolbar.
        if (settings.windowMode)
            windows = $('<div class="main-windows"></div>').appendTo(main);

        // Load components.
        let header = new HeaderComponent();
        header.setTitle(settings.style.images.logo !== '' ?
            '<img class="navbar-logo" alt="' + settings.app.name + '" src="' +
            settings.style.images.logo + '" />' :
            settings.app.name);
        header.load(main);
        header.menuIcon.click(function() {
            header.showMenu();
        });
    }

    maincontainer = $('<div class="row"></div>');
    $('<div class="container"></div>')
        .append(maincontainer)
        .appendTo(main);

}

/**
 * Get the active viewer.
 * @memberof module:backbrace
 * @returns {ViewerComponent} Returns the active viewer.
 */
export function currentPage() {
    if (activePage > 0 && pages.has(activePage))
        return pages.get(activePage);
    return null;
}

/**
 * Load a page.
 * @method loadPage
 * @memberof module:backbrace
 * @param {string} name Name of the page to load.
 * @param {ViewerOptions} [options] Page viewer options.
 * @returns {void}
 */
export function loadPage(name, options) {

    let pge = new ViewerComponent(name, options);

    promisequeue(
        function() {

            if (currentPage())
                currentPage().showLoad();

            // Load the page component.
            return pge.load(maincontainer);
        },
        function() {

            if (currentPage())
                currentPage().hideLoad();

            // Add the page to the loaded pages.
            pages.set(pge.id, pge);
            activePage = pge.id;
        }
    );
}

/**
 * Add a window to the windows toolbar.
 * @ignore
 * @param {number} id ID of the window.
 * @returns {JQuery} Returns the shortcut button.
 */
export function addWindowToToolbar(id) {
    const icons = getIcons(),
        $ = getJQuery(),
        closeBtn = $(icons.get('%close%'))
            .click(function(ev) {
                closePage(id);
                ev.preventDefault();
                return false;
            })
            .css('padding-left', '5px');
    return $('<div id="win' + id + '" class="main-windows-btn unselectable"></div>')
        .hide()
        .appendTo(windows)
        .append('<span />')
        .append(closeBtn)
        .click(function() {
            showPage(id);
        })
        .fadeIn(300);
}

/**
 * Close an opened page.
 * @ignore
 * @param {number} id ID of the page to close.
 * @returns {void}
 */
export function closePage(id) {

    promisequeue(function() {

        // Unload the page.
        if (!pages.has(id))
            throw appError('nopage', 'Cannot find page by id \'{0}\'', id);
        const pge = pages.get(id);
        pge.unload();

        // Remove the page from the loaded pages.
        pages.delete(id);
        if (activePage === id) {

            activePage = 0;

            // Open next page.
            if (pages.size > 0) {
                const nextpge = Array.from(pages.values())[pages.size - 1];
                nextpge.show();
                activePage = nextpge.id;
            }
        }

    });
}

/**
 * Show a loaded page.
 * @ignore
 * @param {number} id ID of the page to show.
 * @returns {void}
 */
export function showPage(id) {

    promisequeue(function() {
        if (id === activePage)
            return;

        // Hide the currently active page.
        if (currentPage())
            currentPage().hide();

        // Show the page.
        if (!pages.has(id))
            throw appError('nopage', 'Cannot find page by id \'{0}\'', id);

        const pge = pages.get(id);
        pge.show();
        activePage = pge.id;
    });
}
