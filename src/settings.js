'use strict';

var flat = require('./styles/flat'),
    minify = true,
    mobile = false;

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
    minify: minify,

    /**
     * Mobile mode flag.
     */
    mobile: mobile,

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

    /**
     * Use window mode?
     */
    windowMode: true,

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
    },

    packages: {

        /**
        * JQuery Package.
        * @returns {string} JQuery script URL.
        */
        jQuery: function() {
            var min = (minify ? '.min' : '');
            return 'https://ajax.googleapis.com/ajax/libs/jquery/' +
                (mobile ? '2.1.0' : '3.2.1') + '/jquery' + min + '.js';
        },

        /**
         * JQuery UI.
         * @returns {Array.<string[]>} JQuery UI scripts and CSS URLS.
         */
        jQueryUI: function() {
            var min = (minify ? '.min' : '');
            if (mobile)
                return [[
                    'https://ajax.googleapis.com/ajax/libs/jquerymobile/' +
                    '1.4.5/jquery.mobile' + min + '.js',
                    'https://ajax.googleapis.com/ajax/libs/jquerymobile/' +
                    '1.4.5/jquery.mobile.min.css'
                ]];
            return [[
                'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1' +
                '/jquery-ui' + min + '.js',
                'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1' +
                '/themes/smoothness/jquery-ui.css'
            ]];
        },

        /**
         * Common packages.
         * @returns {Array.<string[]>} Common scripts and CSS URLS.
         */
        common: function() {
            var min = (minify ? '.min' : '');
            return [
                [
                    'https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons' + min + '.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment' + min + '.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' +
                    (minify ? '.min' : '-dev') + '.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' + min + '.css'
                ],
                [
                    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/en-au.js',
                    'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.js',
                    'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.css'
                ]
            ];
        }
    }
};
