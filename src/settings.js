'use strict';

var flat = require('./styles/flat'),
    settings = {

        /**
         * Version info for JumpStart.
         * @type {object}
         */
        VERSION_INFO: {
            // These placeholder strings will be replaced by grunt's `build` task.
            full: '"JS_VERSION_FULL"'
        },

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

        /**
         * Use window mode?
         */
        windowMode: true,

        app: {

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
             * App description.
             */
            description: 'Web App powered by Jumpstart'
        },

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
                url: 'https://labs.zoomapps.com.au/JumpstartCDN/fonts/roboto/roboto.css',
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
                GOOGLE: 'https://ajax.googleapis.com/ajax/libs',
                JUMPSTART: 'https://labs.zoomapps.com.au/JumpstartCDN'
            },

            /**
            * JQuery Package.
            * @returns {string} JQuery script URL.
            */
            jQuery: function() {
                var min = (settings.minify ? '.min' : '');
                return this.CDN.JUMPSTART + '/jquery/3.3.1/jquery' + min + '.js';
            },

            /**
             * JQuery UI.
             * @returns {Array.<string[]>} JQuery UI scripts and CSS URLS.
             */
            jQueryUI: function() {
                var min = (settings.minify ? '.min' : '');
                return [[
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui' + min + '.js',
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui' + min + '.css',
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui.theme' + min + '.css'
                ]];
            },

            /**
             * Common packages.
             * @returns {Array.<string[]>} Common scripts and CSS URLS.
             */
            common: function() {
                var min = (settings.minify ? '.min' : '');
                return [
                    [
                        this.CDN.JUMPSTART + '/materialdesignicons/2.2.43/css/materialdesignicons'
                        + min + '.css',
                        this.CDN.JUMPSTART + '/moment.js/2.22.0/moment' + min + '.js',
                        this.CDN.JUMPSTART + '/sweetalert/1.1.3/sweetalert' + min + '.js',
                        this.CDN.JUMPSTART + '/sweetalert/1.1.3/sweetalert' + min + '.css'
                    ],
                    [
                        this.CDN.JUMPSTART + '/moment.js/2.22.0/locale/en-au.js',
                        this.CDN.JUMPSTART + '/jquery-ripple/0.2.1/jquery.ripple.js',
                        this.CDN.JUMPSTART + '/jquery-ripple/0.2.1/jquery.ripple.css'
                    ]
                ];
            }
        }
    };

module.exports = settings;
