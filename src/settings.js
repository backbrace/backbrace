'use strict';

var flat = require('./styles/flat');

module.exports = {

    /**
     * Version info for JumpStart.
     * @type {object}
     */
    VERSION_INFO: {
        // These placeholder strings will be replaced by grunt's `build` task.
        full: '"JS_VERSION_FULL"'
    },

    /**
     * App name.
     */
    name: 'jumpstartapp',

    /**
     * App version.
     */
    version: '0.1.0',

    /**
     * App tite (displays in browser window).
     */
    title: 'New Jumpstart App',

    /**
     * Set the app to debug mode.
     */
    debug: false,

    /**
     * Load minified packages.
     */
    minify: true,

    /**
     * Mobile mode flag.
     */
    mobile: false,

    /**
     * GUI allowed flag.
     */
    guiAllowed: true,

    /**
     * Auto switch to mobile mode if detected.
     */
    autoSwitch: true,

    /**
     * JSS style.
     */
    jss: flat,

    meta: {

        dir: './meta/'

    },

    /**
     * App style settings.
     */
    style: {

        loader: {
            zindex: '1000',
            barheight: '10px',
            barwidth: '800px',
            progressbackground: '#A2CFEE',
            progresscolor: '#3498DB',
            blockerbackground: '#ECF0F1'
        },

        font: {
            url: 'https://fonts.googleapis.com/css?family=Roboto:400,500',
            family: '\'Roboto\', sans-serif'
        },

        images: {
            logo: 'https://cdn.jumpstartjs.org/images/logo-light.png',
            menuLogo: 'https://cdn.jumpstartjs.org/images/logo-dark.png',
            blocker: 'https://cdn.jumpstartjs.org/images/logo-portrait.png'
        },

        colors: {
            header: '#3498db',
            headertext: '#FFF',
            headerborder: 'none',
            title: '#FFF',
            titletext: '#000',
            menuicon: '#FFF',
            default: '#FFF',
            defaulttext: '#000',
            hover: 'whitesmoke',
            hovertext: '#000',
            alertbutton: '#3498db',
            alertbuttontext: '#FFF'
        }
    }
};
