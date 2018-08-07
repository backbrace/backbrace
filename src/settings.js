/**
 * App settings.
 * @module settings
 * @private
 */

import { style } from './styles/flat';

/**
 * App settings object.
 * @type {Settings}
 */
export let settings = {

    debug: false,
    minify: true,
    guiAllowed: true,
    jss: style,
    windowMode: true,
    requireAuth: true,
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
        length: 5,
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
            titletext: '#3498db',
            menuicon: '#FFF',
            default: '#FFF',
            defaulttext: '#000',
            hover: 'whitesmoke',
            hovertext: '#000',
            alertbutton: '#3498db',
            alertbuttontext: '#FFF'
        },
        screen: {
            small: 600,
            smallUp: 601,
            medium: 992,
            mediumUp: 993,
            large: 1200,
            largeUp: 1201
        }
    }
};
