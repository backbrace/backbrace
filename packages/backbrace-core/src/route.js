/**
 * Routing module.
 * @module route
 * @private
 */

import $ from 'jquery';
import { loadPage } from './app';
import { error } from './error';
import { RouteError } from './routeerror';

const routeError = error('route', RouteError);

/**
 * @type {routeConfig[]}
 * @ignore
 **/
let routes = [];

/**
 * Add a new route.
 * @param  {...routeConfig} args One or more routes to add.
 * @returns {void}
 */
export function route(...args) {
    routes = routes.concat(args);
}

/**
 * Match a route.
 * @param {string} path Path to match.
 * @returns {*} Returns the matched route.
 */
export function match(path) {

    if (!path)
        return;

    if (path.indexOf('/') === 0 && path !== '/')
        path = path.substr(1);

    let ret = null,
        parr = path.split('/');

    routes.forEach((route) => {
        if (route.path) {
            if (route.path === '**') {
                if (!ret)
                    ret = {
                        page: route.page,
                        params: null
                    };
            } else {
                let p2 = route.path.split('/'),
                    res = true,
                    params = [],
                    page = route.page;
                if (parr.length !== p2.length)
                    return;
                parr.forEach(function(p1, index) {
                    if (index > p2.length - 1) {
                        res = false;
                    } else if (p1 !== p2[index] &&
                        p2[index] !== '*' &&
                        p2[index].indexOf(':') === -1) {
                        res = false;
                    }
                    if (res && p2[index].indexOf(':') === 0) {
                        params[p2[index].substr(1)] = p1;
                        page = page.replace(p2[index], p1);
                    }
                });
                if (res)
                    ret = {
                        page: page,
                        params: params
                    };
            }
        }
    });

    // No routes were matched...
    if (!ret)
        throw routeError('404', 'We can\'t seem to find the page you\'re looking for.');

    return ret;
}

/**
 * Process all links on the current page.
 * @returns {void}
 */
export function processLinks() {
    $('[route]').each((index, val) => {
        var a = $(val);
        if (a.attr('processed') === 'true')
            return;
        a.css('cursor', 'pointer').on('click', async () => {
            var r = match(a.attr('route'));
            if (r)
                await loadPage(r.page, { updateHistory: a.attr('route') }, r.params);
        }).attr('processed', 'true');
    });
}
