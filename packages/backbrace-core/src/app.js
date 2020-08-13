import $ from 'cash-dom';
import deepmerge from 'deepmerge';

import { error } from './error';
import { compile } from './jss';
import { route, processLinks } from './route';
import { settings } from './settings';
import { isDefined, checkBrowser } from './util';

import './components/preloader';

import { get as getStyle, set as setStyle } from './providers/style';
import { get as getWindow } from './providers/window';

/**
 * App module.
 * @module app
 * @private
 */

/** @type {import('./components/app').App} */
export let app = null;

let readyFunc = null,
    appInit = false;

const appError = error('app');

/**
 * @ignore
 * @type {ServiceWorkerRegistration}
 */
let serviceWorkerRegistration = null;

/**
 * Get/set the service worker.
 * @param {ServiceWorkerRegistration} [val] If `defined`, sets the service worker.
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
 * Show a message alert.
 * @async
 * @param {string} msg Message to display.
 * @param {string} [title="Application Message"] Title of the alert.
 * @returns {Promise<void>}
 */
export async function message(msg, title) {
    const style = getStyle();
    await style.message(msg, title || 'Application Message');
}

/**
 * Show a confirmation dialog.
 * @async
 * @param {string} msg Message to display.
 * @param {string} [title="Application Confirmation"] Title of the dialog.
 * @param {string} [yescaption="OK"] Caption of the "yes" button.
 * @param {string} [nocaption="Cancel"] Caption of the "no" button.
 * @returns {Promise<boolean>}
 */
export async function confirm(msg, title, yescaption, nocaption) {
    const style = getStyle();
    return await style.confirm(msg, title || 'Application Confirmation', yescaption, nocaption);
}

/**
 * Execute a function after the app is loaded.
 * @param {import('./types').readyFunction} func Function to execute.
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
    for (let classname in settings.style.colors) {
        let color = settings.style.colors[classname];
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
    }

    //Compile the jss.
    let css = compile(jss);
    $(`<style id="appcolors">${css}</style>`).appendTo('head');
}

/**
 * Load the app style with a loader script. After the style is loaded, the app colors will be loaded.
 * @ignore
 * @async
 * @returns {Promise<void>}
 */
async function loadStyle() {

    if (settings.style.loader) {

        const { default: StyleHandler } = await import(
            /* webpackChunkName: "style-[request]" */
            './styles/loaders/' + settings.style.loader);

        const style = new StyleHandler();
        setStyle(style);
        style.load();
    }

    loadColors();

    if (settings.style.css)
        $(`<link id="appcss" rel="stylesheet" href="${settings.style.css}" >`)
            .appendTo($('head'));
}

/**
 * Start the app.
 * @async
 * @returns {Promise<void>} Returns after the app is started.
 */
export async function start() {

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

        // Load the settings.
        let s = await window.fetch('./design/settings.json');
        if (s.ok) {
            let merged = deepmerge(settings, await s.json());
            Object.assign(settings, merged);
        }

        // Load the routes.
        if (settings.routes && !settings.windowMode)
            route(...settings.routes);

        // Register the service worker.
        if ('serviceWorker' in window.navigator)
            window.navigator.serviceWorker.register('/service-worker.js' + (settings.debug ? '?debug=true' : ''))
                .then(function(reg) {
                    serviceWorker(reg);
                });

        // Update title.
        window.document.title = settings.app.title;

        // Check the browser.
        if (!checkBrowser())
            throw appError('badbrowser', `Your browser is not supported by this app. Please update or use a different browser.
                <p><small>We recommend chrome: <a href="https://www.google.com/chrome/" target="new">click here</a></p></small>`);

        // Start ticking.
        window.setInterval(onTick, 10000);

    }

    // Import the app component.
    const { default: AppComponent } = await import(
        /* webpackChunkName: "app" */
        './components/app');

    await loadStyle();

    // Load the app component.
    app = new AppComponent();

    // Set attributes.
    if (settings.windowMode)
        app.setAttribute('windowmode', 'true');

    $('body').append(app);

    if (readyFunc) {
        await readyFunc(app);
        processLinks(app);
    }

    // Remove the preloader.
    $('bb-preloader').remove();
}

/**
 * Unload the app.
 * @returns {void}
 */
export function unload() {

    readyFunc = null;

    $('#appcolors,#appcss,bb-app').remove();
}
