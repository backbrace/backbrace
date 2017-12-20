'use strict';

var $settings = require('./settings');

module.exports = {

    /**
     * JQuery Package.
     */
    jQuery: function() {
        var min = ($settings.minify ? '.min' : '');
        return 'https://ajax.googleapis.com/ajax/libs/jquery/' +
            ($settings.mobile ? '2.1.0' : '3.2.1') + '/jquery' + min + '.js';
    },

    /**
     * JQuery UI.
     */
    jQueryUI: function() {
        var min = ($settings.minify ? '.min' : '');
        if ($settings.mobile)
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
     */
    common: function() {
        var min = ($settings.minify ? '.min' : '');
        return [
            [
                'https://cdn.materialdesignicons.com/2.0.46/css/materialdesignicons' + min + '.css',
                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment' + min + '.js',
                'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' +
                ($settings.minify ? '.min' : '-dev') + '.js',
                'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' + min + '.css'
            ],
            [
                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/en-au.js',
                'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.js',
                'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.css'
            ]
        ];
    }
};
