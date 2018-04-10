/**
 * Show a progress bar (native).
 * @module progress
 * @private
 */
'use strict';

var settings = require('./settings'),
    jss = require('./jss'),
    util = require('./util'),
    $window = require('./providers/window'),
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
 * @returns {void}
 */
function animate() {

    var window = $window.get(),
        id = window.setInterval(frame, 10),
        clientwidth = window.innerWidth || window.document.documentElement.clientWidth ||
            window.document.body.clientWidth,
        barwidth = parseInt(settings.style.loader.barwidth, 10),
        fromLeft = -barwidth;

    function frame() {
        if (inProgress) {
            if (fromLeft > barwidth + clientwidth) {
                progressbar.style.left = -barwidth + 'px';
                fromLeft = -barwidth;
            } else {
                fromLeft += 10;
                progressbar.style.left = fromLeft + 'px';
            }
        } else {
            window.clearInterval(id);
        }
    }
}

/**
 * Start the animation.
 * @returns {void}
 */
function start() {

    var window = $window.get();

    if (!fadingOut) {
        inProgress = true;
        progressblocker.style.opacity = 1;
        animate();
    } else {
        window.setTimeout(function() {
            start();
        }, 200);
    }
}

/**
 * Stop the animation.
 * @returns {void}
 */
function stop() {

    if (inProgress) {
        fadeOut();
        inProgress = false;
    }
}

/**
 * Fadeout the loader.
 * @returns {void}
 */
function fadeOut() {

    var window = $window.get(),
        op = 1;

    fadingOut = true;
    var timer = window.setInterval(function() {
        if (op <= 0.1) {
            progressblocker.style.opacity = 0;
            window.clearInterval(timer);
            fadingOut = false;
            var element = window.document.getElementsByClassName('progressbar-blocker');
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
 * @returns {boolean} Returns true if the style is added to the DOM.
 */
function createStyle() {

    var window = $window.get(),
        css = jss.compile(style),
        headElement = window.document.head || window.document.getElementsByTagName('head')[0],
        styleElement = window.document.createElement('style');

    // Create the style.
    styleElement.type = 'text/css';
    styleElement.appendChild(window.document.createTextNode(css));

    // Add the style to the head.
    headElement.appendChild(styleElement);
    return true;
}

/**
 * Show the loader.
 * @returns {void}
 */
function show() {

    if (inProgress)
        return;

    var window = $window.get();

    // Compile and add the style
    if (!styleAdded)
        styleAdded = createStyle();

    // Add the elements.
    progressblocker = util.addElement('div', { 'class': 'progressbar-blocker' },
        window.document.body);
    progressbarbg = util.addElement('div', { 'class': 'progressbar-bg' },
        progressblocker);
    progressbar = util.addElement('div', { 'class': 'progressbar' },
        progressblocker);

    // Start the animation.
    start();
}

module.exports = {
    show: show,
    hide: stop
};
