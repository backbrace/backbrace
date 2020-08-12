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
    windowMode: true,
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
        css: '',
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
            bghover: '#CCC',
            texthover: '#333'
        }
    },
    routes: []
};
