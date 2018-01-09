/**
 * App module.
 * @module $app
 */
'use strict';

var $alert = require('./providers/alert'),
    $code = require('./code'),
    $settings = require('./settings'),
    $jss = require('./jss'),
    $log = require('./log'),
    $package = require('./package'),
    $util = require('./util'),
    $window = require('./providers/window'),
    $$progress = require('./progress'),
    AppComponent = require('./components/appcomponent'),
    baseComponent = null,
    readyFunc = null,
    suppressNextError = false;

/**
 * Show a message dialog.
 * @memberof module:$app
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Message"] Title of the dialog.
 * @returns {void}
 */
function message(msg, callbackFn, title) {

    var alert = $alert.get();

    // If there is no gui, just run the callback.
    if (!$settings.guiAllowed) {
        if (callbackFn)
            $util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Message';

    alert.message(msg, callbackFn, title);
}

/**
 * Show a confirmation dialog.
 * @memberof module:$app
 * @param {string} msg Message to display.
 * @param {function(boolean)} callbackFn Callback function to execute after the dialog is dismissed.
 * @param {string} [title="Application Confirmation"] Title of the dialog.
 * @param {string} [yescaption="OK"] Caption of the "yes" button.
 * @param {string} [nocaption="Cancel"] Caption of the "no" button.
 * @returns {void}
 */
function confirm(msg, callbackFn, title, yescaption, nocaption) {

    var alert = $alert.get();

    // If there is no gui, just run the callback.
    if (!$settings.guiAllowed) {
        if (callbackFn)
            $util.setZeroTimeout(callbackFn);
        return;
    }

    title = title || 'Application Confirmation';

    // Fire the event.
    alert.confirm(msg, callbackFn, title, yescaption, nocaption);
}

/**
 * Display an error and kill the current execution.
 * @memberof module:$app
 * @param {string|Error} err Error to display.
 * @returns {void}
 */
function error(err) {

    var alert = $alert.get(),
        msg = '';

    // Get the message.
    if (typeof err === 'string') {
        msg = err;
    } else {
        msg = err.message;
    }

    // Merge string.
    var arr = [msg];
    $util.forEach(arguments, function(a, i) {
        if (i > 0)
            arr.push(a);
    });
    msg = $util.formatString.apply(null, arr);

    $$progress.hide();

    $log.error('Application Error: ' + msg);

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
 * @memberof module:$app
 * @param {Function} func Function to execute.
 * @returns {void}
 */
function ready(func) {
    readyFunc = func;
}

/**
 * Get the base component.
 *
 * NOTE: The base component will be `null` until the `$app.start` function is called.
 * @memberof module:$app
 * @returns {AppComponent} Returns the base component.
 */
function component() {
    return baseComponent;
}

/**
 * Start the app.
 * @memberof module:$app
 * @param {Object} settings Settings for the app.
 * @returns {void}
 */
function start(settings) {

    var window = $window.get();

    // Extend the config.
    $util.extend($settings, settings);

    $log.debugMode($settings.debug);

    // Add font css.
    $util.addElement('link', {
        'href': $settings.style.font.url,
        'rel': 'stylesheet'
    }, window.document.head);

    // Add font family to body tag.
    $util.addElement('style', {}, window.document.head)
        .innerHTML = 'body{font-family: ' + $settings.style.font.family + '}';

    // Set mobile mode.
    if ($settings.autoSwitch && $util.mobileCheck())
        $settings.mobile = true;

    // Add mobile head tags.
    if ($settings.mobile) {

        $util.addElement('meta', {
            'http-equiv': 'X-UA-Compatible',
            'content': 'IE=Edge'
        }, window.document.head);

        $util.addElement('meta', {
            'name': 'viewport',
            'content': 'width=device-width, initial-scale=1, maximum-scale=1, ' +
                'user-scalable=no, minimal-ui'
        }, window.document.head);

        $util.addElement('meta', {
            'name': 'apple-mobile-web-app-capable',
            'content': 'yes'
        }, window.document.head);

        $util.addElement('meta', {
            'name': 'mobile-web-app-capable',
            'content': 'yes'
        }, window.document.head);
    }

    $$progress.show();

    // Update title.
    window.document.title = $settings.app.title;

    // Check for HTML5.
    if (!$util.html5Check())
        error('This app requires a HTML5 browser. We recommend chrome: ' +
            '<a href="https://www.google.com/chrome/" target="new">click here</a>');

    // Load JQuery.
    $package.loadScript($settings.packages.jQuery(), function() {

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
        $package.add($settings.packages.jQueryUI());
        $package.add($settings.packages.common());
        $package.load(function() {

            var $ = require('../external/jquery')(),
                $$sweetalert = require('./sweetalert');

            // Compile JSS and load into a style tag.
            var css = $jss.compile($settings.jss);
            $('<style>')
                .append(css)
                .appendTo($('head'));

            // Lets upgrade alerts...
            $alert.set({
                message: $$sweetalert.show,
                confirm: function(msg, callback, title, yescaption, nocaption) {
                    $$sweetalert.show(msg, function() {
                        callback(true);
                    });
                },
                error: function(msg) {
                    $$sweetalert.show(msg, null, 'Application Error');
                }
            });

            $code.thread(function() {

                return $code.block(

                    function() {
                        // Load base application component.
                        baseComponent = new AppComponent();
                        return baseComponent.load($settings.mobile ? $('.ui-page') : $('body'));
                    },

                    function() {
                        $$progress.hide();
                        if (readyFunc) readyFunc();
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
     * @type {boolean}
     * @private
     */
    suppressNextError: suppressNextError,

    message: message,
    confirm: confirm,
    error: error,
    ready: ready,
    component: component,
    start: start
};
