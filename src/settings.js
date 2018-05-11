/**
 * App settings.
 * @module settings
 * @private
 */
'use strict';

var flat = require('./styles/flat'),
    settings = {

        VERSION_INFO: {
            // These placeholder strings will be replaced by grunt's `build` task.
            full: '"JS_VERSION_FULL"'
        },
        debug: false,
        minify: true,
        mobile: false,
        guiAllowed: true,
        autoSwitch: true,
        jss: flat,
        windowMode: true,
        requireAuth: false,
        app: {
            name: 'Jumpstart App',
            version: '0.1.0',
            title: 'New Jumpstart App',
            description: 'Web App powered by Jumpstart'
        },
        meta: {
            dir: './meta/'
        },
        style: {
            length: 4,
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
                family: '\'Roboto\', sans-serif',
                size: '16px'
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
                titletext: '#34495e',
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

module.exports = settings;
