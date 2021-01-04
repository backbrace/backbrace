import { globals } from './globals';

/**
 * App settings.
 * @module settings
 * @private
 */

/**
 * App settings object.
 * @type {import('./types').settingsConfig}
 */
export let settings = {

    debug: globals.DEVMODE,
    serviceWorker: '/service-worker.js',
    windowMode: false,
    app: {
        name: 'Backbrace App',
        version: '1.0.0',
        title: 'New Backbrace App',
        description: 'Web App powered by Backbrace',
        footer: null
    },
    dir: {
        design: '/design/',
        typings: '/typings/'
    },
    style: {
        loader: 'materialdesign',
        images: {
            logo: '',
            menuLogo: ''
        },
        colors: {
            bgprimary: '#3498db',
            textprimary: '#FFF',
            bgsecondary: '#3498db',
            textsecondary: '#FFF',
            bgsurface: '#FFF',
            textsurface: '#000',
            bgbody: '#f5f7fb',
            textbody: '#000',
            bghover: '#ecf0f1',
            texthover: '#333'
        }
    },
    routes: [],
    head: {
        meta: [
            { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=Edge' },
            { 'name': 'viewport', 'content': 'width=device-width, initial-scale=1, maximum-scale=2, minimal-ui' },
            { 'name': 'apple-mobile-web-app-capable', 'content': 'yes' },
            { 'name': 'mobile-web-app-capable', 'content': 'yes' }
        ],
        link: [],
        script: []
    }
};
