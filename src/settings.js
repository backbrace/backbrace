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
     * App name (displays in header if there is no logo image).
     */
    name: 'Jumpstart App',

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
            logo: '',
            menuLogo: '',
            blocker: ''
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
         * CDN URL's.
         */
        CDN: {
            CLOUD_FLARE: 'https://cdnjs.cloudflare.com/ajax/libs',
            GOOGLE: 'https://ajax.googleapis.com/ajax/libs',
            JUMPSTART: 'https://cdn.jumpstartjs.org',
            MATERIAL_ICONS: 'https://cdn.materialdesignicons.com'
        },

        /**
        * JQuery Package.
        * @returns {string} JQuery script URL.
        */
        jQuery: function() {
            var min = (minify ? '.min' : '');
            return this.CDN.GOOGLE + '/jquery/' +
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
                    this.CDN.GOOGLE + '/jquerymobile/1.4.5/jquery.mobile' + min + '.js',
                    this.CDN.GOOGLE + '/jquerymobile/1.4.5/jquery.mobile.min.css'
                ]];
            return [[
                this.CDN.GOOGLE + '/jqueryui/1.12.1/jquery-ui' + min + '.js',
                this.CDN.GOOGLE + '/jqueryui/1.12.1/themes/smoothness/jquery-ui.css'
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
                    this.CDN.MATERIAL_ICONS + '/2.1.19/css/materialdesignicons' + min + '.css',
                    this.CDN.CLOUD_FLARE + '/moment.js/2.18.1/moment' + min + '.js',
                    this.CDN.CLOUD_FLARE + '/sweetalert/1.1.3/sweetalert' +
                    (minify ? '.min' : '-dev') + '.js',
                    this.CDN.CLOUD_FLARE + '/sweetalert/1.1.3/sweetalert' + min + '.css'
                ],
                [
                    this.CDN.CLOUD_FLARE + '/moment.js/2.18.1/locale/en-au.js',
                    this.CDN.JUMPSTART + '/jquery-ripple/0.2.1/jquery.ripple.js',
                    this.CDN.JUMPSTART + '/jquery-ripple/0.2.1/jquery.ripple.css'
                ]
            ];
        }
    }
};
