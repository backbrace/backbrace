/**
 * App module.
 * @module
 */
'use strict';

var $code = require('./code'),
    $config = require('./config'),
    $event = require('./event'),
    $jss = require('./jss'),
    $log = require('./log'),
    $package = require('./package'),
    $util = require('./util'),
    $window = require('./window').get(),
    loader = require('./content-loader'),
    packages = require('./packages'),
    suppressNextError = false;

/**
 * Show a message dialog.
 * @param {string} msg - Message to display.
 * @param {Function} [callbackFn] - Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Message"] - Title of the dialog.
 */
function message(msg, callbackFn, title) {

    // If there is no gui, just run the callback.
    if (!$config.guiAllowed) {
        if (callbackFn)
            $util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Message';

    // Fire the event.
    $event.fire('js.message', msg, callbackFn, title);
}

/**
 * Show a confirmation dialog.
 * @param {string} msg - Message to display.
 * @param {Function} [callbackFn] - Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Confirmation"] - Title of the dialog.
 * @param {string} [yescaption="OK"] - Caption of the "yes" button.
 * @param {string} [nocaption="Cancel"] - Caption of the "no" button.
 */
function confirm(msg, callbackFn, title, yescaption, nocaption) {

    // If there is no gui, just run the callback.
    if (!$util.guiAllowed) {
        if (callbackFn)
            $util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Confirmation';

    // Fire the event.
    $event.fire('js.confirm', msg, callbackFn, title, yescaption, nocaption);
}

/**
 * Display an error and kill the current execution.
 * @param {*} msg - Message to display.
 * @param {...*} [args] - Arguments to merge into message.
 */
function error(msg, args) {

    msg = msg.message || msg;

    // Merge string.
    if (typeof msg === 'string') {
        var arr = [msg];
        $util.forEach(arguments, function(a, i) {
            if (i > 0)
                arr.push(a);
        });
        msg = $util.formatString.apply(null, arr);
    }

    loader.hide();

    $log.error('Application Error: ' + msg);

    // Run error handling.
    if (!suppressNextError) {

        // Run the event.
        $event.fire('js.error', msg);

        // Kill execution.
        throw new Error('ERROR_HANDLED');
    }

    suppressNextError = false;
}

/**
 * Execute a function after the app is loaded.
 * @param {Function} func - Function to execute.
 */
function ready(func) {
    var $event = require('./event');
    $event.bind('js.loaded', func);
}

/**
 * Start the app.
 * @param {*} settings - Settings for the app.
 */
function start(settings) {

    // Extend the config.
    $util.extend($config, settings);

    $log.debugMode($config.debug);

    // Add font css.
    $util.addElement('link', {
        'href': $config.style.font.url,
        'rel': 'stylesheet'
    }, $window.document.head);

    // Add font family to body tag.
    $util.addElement('style', {}, $window.document.head)
        .innerHTML = 'body{font-family: ' + $config.style.font.family + '}';

    // Set mobile mode.
    if ($config.autoSwitch &&
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
            .test($window.navigator.userAgent.toLowerCase()))
        $config.mobile = true;

    // Add mobile head tags.
    if ($config.mobile) {

        $util.addElement('meta', {
            'http-equiv': 'X-UA-Compatible',
            'content': 'IE=Edge'
        }, $window.document.head);

        $util.addElement('meta', {
            'name': 'viewport',
            'content': 'width=device-width, initial-scale=1, maximum-scale=1, ' +
                'user-scalable=no, minimal-ui'
        }, $window.document.head);

        $util.addElement('meta', {
            'name': 'apple-mobile-web-app-capable',
            'content': 'yes'
        }, $window.document.head);

        $util.addElement('meta', {
            'name': 'mobile-web-app-capable',
            'content': 'yes'
        }, $window.document.head);
    }

    loader.show();

    // Update title.
    $window.document.title = $config.title;

    // Check for HTML5.
    if (!$util.html5Check())
        error('This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Load JQuery.
    $package.loadScript(packages.jQuery(), function() {

        // JQuery wasn't loaded :(
        if (typeof jQuery === 'undefined')
            error('Unable to load the JQuery package');

        function packageError() {
            var url = this.src || this.href || '';
            error('Unable to load ' + url +
                '<br/><br/><a href="" onclick="$js.window.location.reload();">' +
                'Click here to reload</a>');
        }

        // Load all other packages.
        $package.add(packages.jQueryUI());
        $package.add(packages.common());
        $package.load(function() {

            var $ = require('../external/jquery'),
                sweetalert = require('./sweetalert'),
                AppComponent = require('./Components/AppComponent');

            // Compile app JSS and load into a style tag.
            var css = $jss.compile($config.app_jss);
            $('<style>')
                .append(css)
                .appendTo($('head'));

            // Lets upgrade alerts...
            $event.bind('js.message', sweetalert.show, true);
            $event.bind('js.confirm', sweetalert.show, true);
            $event.bind('js.error', function(msg) {
                sweetalert.show(msg, null, 'Application Error');
            }, true);

            $code.thread(function() {

                return $code.block(

                    function() {
                        // Load base application component.
                        var app_component = new AppComponent();
                        return app_component.load($config.mobile ? $('.ui-page') : $('body'));
                    },

                    function() {
                        loader.hide();
                        $event.fire('js.loaded');
                    }
                );
            });

        }, packageError);

    }, function() {

        error('Unable to load the JQuery package');

    });

}

module.exports = {

    /**
     * Suppress the next error thrown.
     */
    suppressNextError: suppressNextError,

    message: message,
    confirm: confirm,
    error: error,
    ready: ready,
    start: start
};
