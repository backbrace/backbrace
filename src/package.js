/**
 * Package manager module. Handles the loading of external packages.
 * @module package
 * @private
 */
'use strict';

var log = require('./log'),
    util = require('./util'),
    $window = require('./providers/window'),
    packages = [],
    loadedPackages = [],
    loadedComponents = [];

/**
 * Load an external script (native).
 * @param {string} url URL to load.
 * @param {*} onsuccess On success function.
 * @param {*} onerror On error function.
 * @returns {void}
 */
function loadScript(url, onsuccess, onerror) {

    var window = $window.get();

    log.debug('Loading script: ' + url);

    var script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = onerror;
    script.onload = onsuccess;

    window.document.head.appendChild(script);
}

/**
 * Load an external css style (native).
 * @param {string} url URL to load.
 * @param {*} onsuccess On success function.
 * @param {*} onerror On error function.
 * @returns {void}
 */
function loadCSS(url, onsuccess, onerror) {

    var window = $window.get();

    log.debug('Loading css: ' + url);

    var css = window.document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = url;
    css.onerror = onerror;
    css.onload = onsuccess;

    window.document.head.appendChild(css);
}

/**
 * Add a package to be loaded.
 * @param {Array.<string[]>} pack Package to load.
 * @returns {void}
 */
function add(pack) {

    var $ = require('../external/jquery')();

    $.each(pack, function(i, urls) {
        $.each(urls || [], function(j, url) {
            if (loadedPackages.indexOf(url) === -1) {
                loadedPackages.push(url);
                packages[i] = packages[i] || [];
                packages[i].push(url);
            }
        });
    });
}

/**
 * Load pending packages.
 * @param {Function} onsuccess On success function.
 * @param {Function} onerror On error function.
 * @returns {void}
 */
function load(onsuccess, onerror) {

    var $ = require('../external/jquery')(),
        urls = packages.shift(),
        styles = [],
        scripts = [],
        loadedResources = 0;

    onsuccess = onsuccess || util.noop;

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
            if (++loadedResources === urls.length)
                load(onsuccess, onerror);
        }, onerror);
    });

    $.each(styles, function(i, style) {
        loadCSS(style, function() {
            if (++loadedResources === urls.length)
                load(onsuccess, onerror);
        }, onerror);
    });
}

module.exports = {
    loadScript: loadScript,
    loadCSS: loadCSS,
    add: add,
    load: load
};
