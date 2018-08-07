/**
 * Show a progress bar (native).
 * @module progress
 * @private
 */

import { compile } from './jss';
import { settings } from './settings';
import { addElement, isMobileDevice } from './util';
import { get as getWindow } from './providers/window';

const style = {
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

let progressbar,
    progressblocker,
    inProgress = false,
    fadingOut = false,
    styleAdded = false;

/**
 * Animate the progress bar.
 * @returns {void}
 */
function animate() {

    const window = getWindow(),
        id = window.setInterval(frame, 10),
        clientwidth = window.innerWidth || window.document.documentElement.clientWidth ||
            window.document.body.clientWidth,
        barwidth = parseInt(settings.style.loader.barwidth, 10);

    let fromLeft = -barwidth;

    /**
     * Render a frame of the animation.
     * @returns {void}
     */
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

    const window = getWindow();

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
 * Fadeout the loader.
 * @returns {void}
 */
function fadeOut() {

    const window = getWindow();
    let op = 1,
        removeBlocker = () => {
            let element = window.document.getElementsByClassName('progressbar-blocker');
            if (element.length > 0)
                element[0].outerHTML = '';
        };

    if (isMobileDevice()) {
        removeBlocker();
        return;
    }

    fadingOut = true;
    let timer = window.setInterval(function() {
        if (op <= 0.1) {
            progressblocker.style.opacity = 0;
            window.clearInterval(timer);
            fadingOut = false;
            removeBlocker();
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

    const window = getWindow(),
        css = compile(style),
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
export function show() {

    if (inProgress)
        return;

    const window = getWindow();

    // Compile and add the style
    if (!styleAdded)
        styleAdded = createStyle();

    // Add the elements.
    progressblocker = addElement('div', { 'class': 'progressbar-blocker' }, window.document.body);
    addElement('div', { 'class': 'progressbar-bg' }, progressblocker);
    progressbar = addElement('div', { 'class': 'progressbar' }, progressblocker);

    // Start the animation.
    start();
}

/**
 * Stop the animation.
 * @returns {void}
 */
export function hide() {

    if (inProgress) {
        fadeOut();
        inProgress = false;
    }
}
