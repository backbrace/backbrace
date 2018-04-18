/**
 * Package manager module. Handles the loading of external packages.
 * @module packagemanager
 * @private
 */
'use strict';

var code = require('./code'),
    log = require('./log'),
    util = require('./util'),
    windowprovider = require('./providers/window'),
    packages = [],
    loadedPackages = [];

/**
 * Load an external script (native).
 * @param {string} url URL to load.
 * @param {*} onsuccess On success function.
 * @param {*} onerror On error function.
 * @returns {void}
 */
function loadScript(url, onsuccess, onerror) {

    var window = windowprovider.get();

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

    var window = windowprovider.get();

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

    var $ = require('../external/jquery');

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
    var $ = require('../external/jquery');
    code.insert(
        function() {
            'inserted';
            var d = $.Deferred();
            loadpackages(function() {
                d.resolve();
            }, onerror);
            return d.promise();
        },
        function() {
            'inserted';
            onsuccess();
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
function loadpackages(onsuccess, onerror) {

    var $ = require('../external/jquery'),
        urls = packages.shift(),
        styles = [],
        scripts = [],
        totalLoaded = 0;

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

module.exports = {
    loadScript: loadScript,
    loadCSS: loadCSS,
    add: add,
    load: load
};
