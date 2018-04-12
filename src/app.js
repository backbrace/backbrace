/**
 * App module.
 * @module app
 * @private
 */
'use strict';

var alertprovider = require('./providers/alert'),
    code = require('./code'),
    settings = require('./settings'),
    jss = require('./jss'),
    log = require('./log'),
    packages = require('./packages'),
    progress = require('./progress'),
    resources = require('./resources'),
    util = require('./util'),
    windowprovider = require('./providers/window'),
    header = null,
    /** @type {JQuery} */
    main = null,
    /** @type {JQuery} */
    windows = null,
    pages = {},
    activePage = 0,
    readyFunc = null,
    suppressNextError = false;

/**
 * Show a message dialog.
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Message"] Title of the dialog.
 * @returns {void}
 */
function message(msg, callbackFn, title) {

    var alert = alertprovider.get();

    // If there is no gui, just run the callback.
    if (!settings.guiAllowed) {
        if (callbackFn)
            util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Message';

    alert.message(msg, callbackFn, title);
}

/**
 * Show a confirmation dialog.
 * @param {string} msg Message to display.
 * @param {function(boolean)} callbackFn Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Confirmation"] Title of the dialog.
 * @param {string} [yescaption="OK"] Caption of the "yes" button.
 * @param {string} [nocaption="Cancel"] Caption of the "no" button.
 * @returns {void}
 */
function confirm(msg, callbackFn, title, yescaption, nocaption) {

    var alert = alertprovider.get();

    // If there is no gui, just run the callback.
    if (!settings.guiAllowed) {
        if (callbackFn)
            util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Confirmation';

    // Fire the event.
    alert.confirm(msg, callbackFn, title, yescaption, nocaption);
}

/**
 * Display an error and kill the current execution.
 * @param {string|Error} err Error to display.
 * @returns {void}
 */
function error(err) {

    var alert = alertprovider.get(),
        msg = '';

    // Get the message.
    if (typeof err === 'string') {
        msg = err;
    } else {
        msg = err.message;
    }

    // Merge string.
    var arr = [msg];
    util.forEach(arguments, function(a, i) {
        if (i > 0)
            arr.push(a);
    });
    msg = util.formatString.apply(null, arr);

    progress.hide();

    log.error('Application Error: ' + msg);

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
 * @memberof module:Jumpstart
 * @param {Function} func Function to execute.
 * @returns {void}
 */
function ready(func) {
    readyFunc = function() {
        code.thread(func);
    };
}

/**
 * Start the app.
 * @memberof module:Jumpstart
 * @returns {void}
 */
function start() {

    var window = windowprovider.get();

    // Add font css.
    util.addElement('link', {
        'href': settings.style.font.url,
        'rel': 'stylesheet'
    }, window.document.head);

    util.addElement('meta', {
        'name': 'Description',
        'content': settings.app.description
    }, window.document.head);

    // Add font family to body tag.
    util.addElement('style', {}, window.document.head)
        .innerHTML = 'body{font-family: ' + settings.style.font.family + '}';

    // Set mobile mode.
    if (settings.autoSwitch && util.mobileCheck())
        settings.mobile = true;

    // Add mobile head tags.
    if (settings.mobile) {

        util.addElement('meta', {
            'http-equiv': 'X-UA-Compatible',
            'content': 'IE=Edge'
        }, window.document.head);

        util.addElement('meta', {
            'name': 'viewport',
            'content': 'width=device-width, initial-scale=1, maximum-scale=2, minimal-ui'
        }, window.document.head);

        util.addElement('meta', {
            'name': 'apple-mobile-web-app-capable',
            'content': 'yes'
        }, window.document.head);

        util.addElement('meta', {
            'name': 'mobile-web-app-capable',
            'content': 'yes'
        }, window.document.head);
    }

    progress.show();

    // Update title.
    window.document.title = settings.app.title;

    // Check for HTML5.
    if (!util.html5Check())
        error('This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Load JQuery.
    resources.loadScript(packages.jQuery(), function() {

        // JQuery wasn't loaded :(
        if (typeof jQuery === 'undefined')
            error('Unable to load the JQuery package');

        function packageError() {
            var url = this.src || this.href || '';
            error('Unable to load ' + url +
                '<br/><br/><a href="" onclick="window.location.reload();">' +
                'Click here to reload</a>');
        }

        // Load startup packages.
        resources.add(packages.startup());
        resources.load(function() {

            var $ = require('../external/jquery')(),
                sweetalert = require('./sweetalert');

            // Compile JSS and load into a style tag.
            var css = jss.compile(settings.jss);
            $('<style>')
                .append(css)
                .appendTo($('head'));

            // Lets upgrade alerts...
            alertprovider.set({
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

            code.thread(function() {

                load($('body'));

                progress.hide();
                if (readyFunc) readyFunc();

            });

        }, packageError);

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
function load(container) {

    var $ = require('../external/jquery')(),
        HeaderComponent = require('./components/headercomponent');

    main = $('<div class="main"></div>').appendTo(container);

    // Add window toolbar.
    if (settings.windowMode && !settings.mobile)
        windows = $('<div class="main-windows"></div>').appendTo(main);

    $('body').addClass(settings.mobile ? 'mobile-app' : 'desktop-app');

    // Load components.
    header = new HeaderComponent({});
    header.setTitle(settings.style.images.logo !== '' ?
        '<img class="navbar-logo" alt="' + settings.app.name + '" src="' +
        settings.style.images.logo + '" />' :
        settings.app.name);
    if (!settings.mobile) {
        header.load(main);
        header.navbar.addClass('fixed');
        header.menuIcon.click(function() {
            header.showMenu();
        });
    }
}

/**
 * Load a page.
 * @memberof module:Jumpstart
 * @param {string} name Name of the page to load.
 * @param {Object} [options] Page options.
 * @returns {void}
 */
function loadPage(name, options) {

    var PageComponent = require('./components/pagecomponent'),
        pge = new PageComponent(name, options || {});

    pge.options.first = Object.keys(pages).length === 0;
    if (pge.options.first && settings.mobile)
        pge.header = header;

    code.thread(
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
 * @param {number} id ID of the window.
 * @returns {void}
 */
function addWindowToToolbar(id) {
    var icons = require('./providers/icons').get(),
        $ = require('../external/jquery')(),
        closeBtn = $(icons.get('close'))
            .click(function() {
                closePage(id);
            })
            .css('padding-left', '5px');
    $('<div id="win' + id + '" class="main-windows-btn unselectable"></div>')
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
 * @param {number} id ID of the page to close.
 * @returns {void}
 */
function closePage(id) {
    code.thread(function() {

        // Unload the page.
        /** @type {Component} */
        var pge = pages[id];
        if (!util.isDefined(pge))
            error('Cannot find page by id: {0}', id);
        pge.unload();

        // Remove the page from the loaded pages.
        pages[id] = null;
        delete pages[id];
        if (activePage === id)
            activePage = 0;

        // Open next page.
        var keys = Object.keys(pages);
        if (keys.length > 0) {
            /** @type {Component} */
            var nextpge = pages[keys[keys.length - 1]];
            nextpge.show();
            activePage = nextpge.id;
        }

    });
}

/**
 * Show a loaded page.
 * @param {number} id ID of the page to show.
 * @returns {void}
 */
function showPage(id) {

    if (id === activePage)
        return;

    // Hide the currently active page.
    if (activePage > 0 && pages[activePage])
        pages[activePage].hide();

    // Show the page.
    /** @type {Component} */
    var pge = pages[id];
    if (!util.isDefined(pge))
        error('Cannot find page by id: {0}', id);

    pge.show();
    activePage = pge.id;
}

module.exports = {
    suppressNextError: suppressNextError,
    message: message,
    confirm: confirm,
    error: error,
    ready: ready,
    start: start,
    loadPage: loadPage,
    closePage: closePage,
    showPage: showPage,
    addWindowToToolbar: addWindowToToolbar
};
