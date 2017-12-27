/**
 * Show a content loading animation.
 * @module
 */
'use strict';

var $settings = require('./settings'),
    $jss = require('./jss'),
    $util = require('./util'),
    progressbar,
    progressbarbg,
    progressblocker,
    inProgress = false,
    fadingOut = false,
    styleAdded = false,
    style = {
        '.progressbar': {
            display: 'block',
            'z-index': '%loader:zindex%',
            position: 'fixed',
            width: '%loader:barwidth%',
            height: '%loader:barheight%',
            left: '-%loader:barwidth%',
            top: '0px',
            background: '%loader:progresscolor%'
        },
        '.progressbar-bg': {
            position: 'fixed',
            width: '100%',
            height: '%loader:barheight%',
            left: '0px',
            top: '0px',
            background: '%loader:progressbackground%'
        },
        '.progressbar-blocker': {
            'z-index': '50000',
            position: 'fixed',
            width: '100%',
            height: '100vh',
            left: '0px',
            top: '0px',
            background: '%loader:blockerbackground% url(%images:blocker%) no-repeat center ' +
                'center fixed'
        }
    };

/**
 * Animate the progress bar.
 */
function animate() {

    var $window = require('./Providers/window').get(),
        id = $window.setInterval(frame, 10),
        client_width = $window.innerWidth || $window.document.documentElement.clientWidth ||
            $window.document.body.clientWidth,
        bar_width = parseInt($settings.style.loader.barwidth, 10),
        fromLeft = -bar_width;

    function frame() {
        if (inProgress) {
            if (fromLeft > bar_width + client_width) {
                progressbar.style.left = -bar_width + 'px';
                fromLeft = -bar_width;
            } else {
                fromLeft += 10;
                progressbar.style.left = fromLeft + 'px';
            }
        } else {
            $window.clearInterval(id);
        }
    }
}

/**
 * Start the animation.
 */
function start() {

    var $window = require('./Providers/window').get();

    if (!fadingOut) {
        inProgress = true;
        progressblocker.style.opacity = 1;
        animate();
    } else {
        $window.setTimeout(function() {
            start();
        }, 200);
    }
}

/**
 * Stop the animation.
 */
function stop() {

    if (inProgress) {
        fadeOut();
        inProgress = false;
    }
}

/**
 * Fadeout the loader.
 */
function fadeOut() {

    var $window = require('./Providers/window').get(),
        op = 1;

    fadingOut = true;
    var timer = $window.setInterval(function() {
        if (op <= 0.1) {
            progressblocker.style.opacity = 0;
            $window.clearInterval(timer);
            fadingOut = false;
            var element = $window.document.getElementsByClassName('progressbar-blocker');
            if (element.length > 0)
                element[0].outerHTML = '';
        } else {
            progressblocker.style.opacity = op;
            progressblocker.style.filter = 'alpha(opacity=' + (op * 100) + ')';
            op -= op * 0.1;
        }
    }, 10);
}

/**
 * Compile and add the style to the DOM.
 * @returns {boolean}
 */
function createStyle() {

    var $window = require('./Providers/window').get(),
        css = $jss.compile(style),
        head_element = $window.document.head || $window.document.getElementsByTagName('head')[0],
        style_element = $window.document.createElement('style');

    // Create the style.
    style_element.type = 'text/css';
    style_element.appendChild($window.document.createTextNode(css));

    // Add the style to the head.
    head_element.appendChild(style_element);
    return true;
}

/**
 * Show the loader.
 */
function show() {

    if (inProgress)
        return;

    var $window = require('./Providers/window').get();

    // Compile and add the style
    if (!styleAdded)
        styleAdded = createStyle();

    // Add the elements.
    progressblocker = $util.addElement('div', { 'class': 'progressbar-blocker' },
        $window.document.body);
    progressbarbg = $util.addElement('div', { 'class': 'progressbar-bg' },
        progressblocker);
    progressbar = $util.addElement('div', { 'class': 'progressbar' },
        progressblocker);

    // Start the animation.
    start();
}

module.exports = {
    show: show,
    hide: stop
};
