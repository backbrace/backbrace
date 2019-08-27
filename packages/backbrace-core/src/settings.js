/**
 * App settings.
 * @module settings
 * @private
 */

/**
 * App settings object.
 * @type {settingsConfig}
 */
export let settings = {

    debug: false,
    minify: true,
    guiAllowed: true,
    windowMode: true,
    app: {
        name: 'Backbrace App',
        version: '1.0.0',
        title: 'New Backbrace App',
        description: 'Web App powered by Backbrace'
    },
    dir: {
        design: '/design/',
        tern: '/json/'
    },
    style: {
        loader: 'materialdesign',
        css: '',
        images: {
            logo: '',
            menuLogo: '',
            blocker: ''
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
    }
};
