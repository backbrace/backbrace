/**
 * App module.
 * @module app
 * @private
 */

import { codeblock, codethread, onerror as onCodeError } from './code';
import { compile } from './jss';
import { error as logError } from './log';
import * as packagemanager from './packagemanager';
import * as progress from './progress';
import { settings } from './settings';
import * as sweetalert from './sweetalert';
import {
    setZeroTimeout,
    forEach,
    formatString,
    addElement,
    isDefined,
    isHtml5,
    isMobileDevice
} from './util';
import { get as getAlert, set as setAlert } from './providers/alert';
import { get as getIcons } from './providers/icons';
import { get as getJQuery } from './providers/jquery';
import { get as getServer } from './providers/server';
import { get as getWindow } from './providers/window';
import { HeaderComponent } from './components/header';
import { ViewerComponent } from './components/viewer';

let main = null,
    windows = null,
    pages = {},
    activePage = 0,
    readyFunc = null,
    suppressNextError = false;

/**
 * Show a message dialog.
 * @ignore
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the dialog is dismissed.
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
 * @param {function(boolean)} callbackFn Callback function to execute after the dialog is dismissed.
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
 * @param {string|Error} err Error to display.
 * @returns {void}
 */
export function error(err) {

    const alert = getAlert();
    let msg = '';

    // Get the message.
    if (typeof err === 'string') {
        msg = err;
    } else {
        msg = err.message;
    }

    // Merge string.
    const arr = [msg];
    forEach(arguments, function(a, i) {
        if (i > 0)
            arr.push(a);
    });
    msg = formatString.apply(null, arr);

    progress.hide();

    logError('Application Error: ' + msg);

    // Run error handling.
    if (!suppressNextError) {

        // Run the event.
        alert.error(msg);

        // Kill execution.
        throw new Error('ERROR_HANDLED');
    }

    suppressNextError = false;
}

/**
 * Execute a function after the app is loaded.
 * @method ready
 * @memberof module:js
 * @param {Function} func Function to execute.
 * @returns {void}
 */
export function ready(func) {
    readyFunc = func;
}

/**
 * Start the app.
 * @method start
 * @memberof module:js
 * @returns {void}
 */
export function start() {

    const window = getWindow();

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
        error('This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Load JQuery.
    packagemanager.loadScript('jquery', function() {

        // JQuery wasn't loaded :(
        const $ = getJQuery();
        if ($ === null)
            error('Unable to load the JQuery package');

        /**
         * Handle package errors.
         * @ignore
         * @returns {void}
         */
        function packageError() {
            const url = this.src || this.href || '';
            error('Unable to load ' + url +
                '<br/><br/><a href="" onclick="window.location.reload();">' +
                'Click here to reload</a>');
        }

        // Set the code execution error handler.
        onCodeError(error);

        // Load startup packages.
        codethread(function() {

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

                return codeblock(

                    readyFunc,

                    (settings.requireAuth === true ? function() {

                        const server = getServer();
                        return server.autoLogin();

                    } : null)
                );

            }, packageError);
        });

    }, function() {

        error('Unable to load the JQuery package');

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

    main = $('<div class="main"></div>').appendTo(container);

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
}

/**
 * Load a page.
 * @method loadPage
 * @memberof module:js
 * @param {string} name Name of the page to load.
 * @param {ViewerOptions} [options] Page viewer options.
 * @returns {void}
 */
export function loadPage(name, options) {

    let pge = new ViewerComponent(name, options);

    codethread(
        function() {
            // Load the page component.
            return pge.load(main);
        },
        function() {

            // Hide the currently active page.
            if (activePage > 0 && pages[activePage])
                pages[activePage].hide();

            // Add the page to the loaded pages.
            pages[pge.id] = pge;
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
            .click(function() {
                closePage(id);
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
    codethread(function() {

        // Unload the page.
        const pge = pages[id];
        if (!isDefined(pge))
            error('Cannot find page by id: {0}', id);
        pge.unload();

        // Remove the page from the loaded pages.
        pages[id] = null;
        delete pages[id];
        if (activePage === id)
            activePage = 0;

        // Open next page.
        const keys = Object.keys(pages);
        if (keys.length > 0) {
            const nextpge = pages[keys[keys.length - 1]];
            nextpge.show();
            activePage = nextpge.id;
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

    if (id === activePage)
        return;

    // Hide the currently active page.
    if (activePage > 0 && pages[activePage])
        pages[activePage].hide();

    // Show the page.
    const pge = pages[id];
    if (!isDefined(pge))
        error('Cannot find page by id: {0}', id);

    pge.show();
    activePage = pge.id;
}
