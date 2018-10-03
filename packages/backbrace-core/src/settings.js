/**
 * App settings.
 * @module settings
 * @private
 */

import { globals } from './globals';
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
    packages: `${globals.CDNSERVER}/packages`,
    app: {
        name: 'Backbrace App',
        version: '1.0.0',
        title: 'New Backbrace App',
        description: 'Web App powered by Backbrace'
    },
    meta: {
        dir: './meta/'
    },
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
            url: `${globals.CDNSERVER}/packages/roboto/css/roboto/roboto-fontface.css`,
            family: '\'Roboto\', sans-serif'
        },
        images: {
            logo: '',
            menuLogo: '',
            blocker: ''
        },
        colors: {
            primary: '#3498db',
            primarytext: '#FFF',
            primaryvar: '#006aa9',
            primaryvartext: '#FFF',
            secondary: '#34495e',
            secondarytext: '#FFF',
            secondaryvar: '#092234',
            secondaryvartext: '#FFF',
            surface: '#FFF',
            surfacetext: '#000',
            background: '#f5f7fb',
            backgroundtext: '#000',
            hover: 'whitesmoke',
            hovertext: '#000'
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
