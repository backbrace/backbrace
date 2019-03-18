/**
 * Package manager module. Handles the loading of external packages.
 * @module packagemanager
 * @private
 */

import $ from 'jquery';
import { promiseinsert } from './promises';
import { error } from './error';
import { debug as logDebug } from './log';
import { get as getPackage, exists as packageExists } from './packages';
import { noop } from './util';
import { get as getWindow } from './providers/window';

const packages = [],
    loadedPackages = [],
    packageError = error('packagemanager'),
    errorHandler = function() {
        let url = this.src || this.href || '';
        throw packageError('load', 'Unable to load \'{0}\'', url);
    };

/**
 * Load an external script (native).
 * @param {string} url URL to load.
 * @param {*} [onsuccess] On success function.
 * @param {*} [onerror] On error function.
 * @returns {void}
 */
export function loadScript(url, onsuccess, onerror) {

    const window = getWindow();

    if (packageExists(url)) {
        let pack = getPackage(url);
        url = pack[0][0];
    }

    logDebug('Loading script: ' + url);

    let script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = onerror || errorHandler;
    script.onload = onsuccess;

    window.document.head.appendChild(script);
}

/**
 * Load an external css style (native).
 * @param {string} url URL to load.
 * @param {*} [onsuccess] On success function.
 * @param {*} [onerror] On error function.
 * @returns {void}
 */
export function loadCSS(url, onsuccess, onerror) {

    const window = getWindow();

    logDebug('Loading css: ' + url);

    let css = window.document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = url;
    css.onerror = onerror || errorHandler;

    window.document.head.appendChild(css);

    if (onsuccess) onsuccess();
}

/**
 * Add a package to be loaded.
 * @param {(Array.<string[]>|string)} pack Package to load.
 * @param {number} [offset] Level offset.
 * @returns {void}
 */
export function add(pack, offset) {


    if (typeof pack === 'string') {
        if (!packageExists(pack))
            throw packageError('add', 'Package not found \'{0}\'', pack);
        pack = getPackage(pack);
    }

    offset = offset || 0;
    $.each(pack, function(i, urls) {
        $.each(urls || [], function(j, url) {
            if (loadedPackages.indexOf(url) === -1) {
                loadedPackages.push(url);
                packages[i + offset] = packages[i + offset] || [];
                packages[i + offset].push(url);
            }
        });
    });
}

/**
 * Load pending packages.
 * @param {Function} onsuccess On success function.
 * @param {Function} [onerror] On error function.
 * @returns {void}
 */
export function load(onsuccess, onerror) {

    promiseinsert(
        function() {
            'inserted';
            let d = $.Deferred();
            loadpackages(function() {
                d.resolve();
            }, onerror || errorHandler);
            return d.promise();
        },
        function() {
            'inserted';
            return onsuccess();
        }
    );
}

/**
 * Load pending packages (private).
 * @private
 * @param {Function} onsuccess On success function.
 * @param {Function} onerror On error function.
 * @returns {void}
 */
export function loadpackages(onsuccess, onerror) {

    const urls = packages.shift();
    let styles = [],
        scripts = [],
        totalLoaded = 0;

    onsuccess = onsuccess || noop;

    if (!urls)
        return onsuccess();

    styles = $.grep(urls, function(v) {
        return v.indexOf('.css') !== -1;
    });

    scripts = $.grep(urls, function(v) {
        return v.indexOf('.js') !== -1;
    });

    $.each(scripts, function(i, script) {
        loadScript(script, function() {
            if (++totalLoaded === urls.length)
                loadpackages(onsuccess, onerror);
        }, onerror);
    });

    $.each(styles, function(i, style) {
        loadCSS(style, function() {
            if (++totalLoaded === urls.length)
                loadpackages(onsuccess, onerror);
        }, onerror);
    });
}
