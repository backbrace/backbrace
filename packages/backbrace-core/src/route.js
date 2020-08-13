import $ from 'cash-dom';

import { app } from './app';
import { error } from './error';
import { makeSingle } from './util';

import { get as getWindow } from './providers/window';
import { settings } from './settings';
import { appState } from './state';

const routeError = error('route');

/**
 * Routing module.
 * @module route
 * @private
 */

/**
 * @type {import('./types').routeConfig[]}
 * @ignore
 **/
let routes = [];

/**
 * Load a page.
 * @ignore
 * @param {import('./types').routeConfig} r Route.
 * @returns {Generator} Returns after loading the page.
 */
function* loadPage(r) {
    yield app.loadPage(r.page, r.params);
}

/**
 * Add a new route.
 * @param  {...import('./types').routeConfig} args One or more routes to add.
 * @returns {void}
 */
export function route(...args) {
    routes = routes.concat(args);
}

/**
 * Get the window path name.
 * @returns {string}
 */
function pathName() {
    const window = getWindow();
    return window.location.pathname.replace(settings.base, '');
}

/**
 * Intialize the router.
 * @async
 * @returns {Promise<void>}
 */
export async function init() {

    const window = getWindow(),
        loadPageSingle = makeSingle(loadPage);

    window.onpopstate = async () => {
        var r = match(pathName());
        if (r) {
            loadPageSingle(r, pathName());
        }
    };

    let route = match(pathName());
    if (route)
        await app.loadPage(route.page, route.params);
}

/**
 * Navigate to a path name.
 * @async
 * @param {string} path Path name to navigate to.
 * @returns {Promise<void>}
 */
export async function navigate(path) {
    let route = match(path);
    if (route)
        await app.loadPage(route.page, route.params);
}

/**
 * Match a route.
 * @param {string} path Path to match.
 * @param {Object} [pathparams] Default path params.
 * @returns {import('./types').routeConfig} Returns the matched route.
 */
export function match(path, pathparams) {

    if (!path)
        return;

    if (path.indexOf('/') === 0 && path !== '/')
        path = path.substr(1);

    let ret = null,
        parr = path.split('/');

    routes.forEach((route) => {
        if (route.path && !ret) {

            let p2 = route.path.split('/'),
                res = true,
                params = Object.assign({}, route.params || pathparams, {}),
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
            if (res) {
                if (route.private && !appState.isAuthenticated) {
                    if (settings.auth.login)
                        ret = match(settings.auth.login, {
                            callbackPath: path
                        });
                } else {
                    ret = {
                        page: page,
                        params: params
                    };
                }
            }
        }
    });

    // No routes were matched...
    if (!ret)
        throw routeError('404', `We can't seem to find the page you're looking for. Path: ${path}`);

    return ret;
}

/**
 * Process all links on the current page.
 * @param {import('./components/component').Component} comp Component to process.
 * @returns {void}
 */
export function processLinks(comp) {

    const onclick = (path) => {
        const window = getWindow(),
            loadPageSingle = makeSingle(loadPage),
            r = match(path);
        if (r) {
            loadPageSingle(r, path);
            if (window.history)
                window.history.pushState(null, r.page, path === '/' ? settings.base || path : path);
        }
    };

    $(comp).find('[bb-route]').each((index, val) => {
        var a = $(val);
        if (a.attr('bb-route-processed') === 'true')
            return;
        if (a.attr('bb-route') === '') {
            a.attr('bb-route-processed', 'true');
            return;
        }
        a.css('cursor', 'pointer').on('click', e => {
            onclick(a.attr('bb-route'));
            e.cancelBubble = true;
            return false;
        }).attr('bb-route-processed', 'true');
    });
}
