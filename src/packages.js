/**
 * Resource packages.
 * @module packages
 * @private
 */
'use strict';

var settings = require('./settings'),
    packages = {

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
         * Startup packages.
         * @returns {Array.<string[]>} Jumpstart startup scripts and CSS URLS.
         */
        startup: function() {
            var min = (settings.minify ? '.min' : '');
            return [
                [
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui' + min + '.js',
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui' + min + '.css',
                    this.CDN.JUMPSTART + '/jqueryui/1.12.1/jquery-ui.theme' + min + '.css'
                ],
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
    };

module.exports = packages;
