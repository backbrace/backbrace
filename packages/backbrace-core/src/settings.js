/**
 * App settings.
 * @module settings
 * @private
 */

/**
 * App settings object.
 * @type {Settings}
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
    meta: {
        dir: '/meta/'
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
            bgprimaryvar: '#006aa9',
            textprimaryvar: '#FFF',
            bgsecondary: '#34495e',
            textsecondary: '#FFF',
            bgsecondaryvar: '#092234',
            textsecondaryvar: '#FFF',
            bgsurface: '#FFF',
            textsurface: '#000',
            bgbody: '#f5f7fb',
            textbody: '#000',
            bghover: 'whitesmoke',
            texthover: '#000'
        }
    }
};
