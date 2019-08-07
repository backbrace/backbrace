/**
 * Material design loader module.
 * @module materialdesignloader
 * @private
 */

import 'npm/roboto-fontface/css/roboto/sass/roboto-fontface.scss';
import 'npm/@mdi/font/scss/materialdesignicons.scss';
import '../materialdesign/materialdesign.scss';

import $ from 'jquery';
import { compile } from '../../jss';
import { settings } from '../../settings';
import { set as setIcon } from '../../providers/icons';
import { set as setProgress } from '../../providers/progress';

/**
 * Style Load function. Runs after the style sheets have been imported.
 * @method load
 * @returns {void}
 */
export default function load() {

    setIcon({
        get: function(name, className) {

            if (!name)
                return '';

            // Set defaults.
            name = name || 'alert';

            // Map template.
            if (name.indexOf('%') === 0) {
                if (name === '%new%') {
                    name = 'plus';
                } else if (name === '%delete%') {
                    name = 'close';
                } else {
                    name = name.replace(/%/g, '');
                }
            }

            // Prepend mdi- if missing.
            if (name.indexOf('mdi-') !== 0)
                name = 'mdi-' + name;

            return '<i class="mdi ' + name + (className ? ' ' + className : '') + '" />';
        }
    });

    setProgress(`<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class="circle" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>`);

    // Load the style overrides.
    const colors = settings.style.colors,
        shadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)';
    let css = compile({
        // Add Colors.
        'body': {
            background: `${colors.bgbody}`,
            color: `${colors.textbody}`
        },
        '.navbar': {
            background: `${colors.bgprimary}`,
            color: `${colors.textprimary}`
        },
        '.main-windows,.window': {
            background: `${colors.bgsurface}`
        },
        '.main-windows-btn.active': {
            'border-bottom': `2px solid ${colors.bgprimary}`,
            background: `${colors.bghover}`,
            color: `${colors.bgprimary}`
        },
        '.main-windows-btn:hover': {
            background: `${colors.bghover}`,
            color: `${colors.texthover}`
        },
        '.mobile-app .viewer': {
            background: `${colors.bgsurface}`
        },
        '.mobile-app .actions-bar': {
            'background-color': `${colors.bgsecondary}`,
            '-webkit-box-shadow': `${shadow}`,
            'box-shadow': `${shadow}`
        },
        '.action-button:hover': {
            background: `${colors.bghover}`,
            color: `${colors.texthover}`
        },
        '.field-input:focus': {
            'border-color': `${colors.bgprimary}`,
            'border-width': '2px'
        },
        '.preloader': {
            background: `${colors.bgsurface}`
        },
        '.overlay': {
            background: `${colors.bgsurface}`
        },
        // Add Shadows.
        '.navbar-inner,.menu': {
            '-webkit-box-shadow': `${shadow}`,
            'box-shadow': `${shadow}`
        },
        '.desktop-app .preloader,.window': {
            '-webkit-box-shadow': `${shadow}`,
            'box-shadow': `${shadow}`
        },
        // Override external.
        '.ui-state-highlight': {
            background: `${colors.bghover} !important`,
            color: `${colors.texthover} !important`
        },
        '.sweet-alert button': {
            'background-color': `${colors.bgsecondary} !important`,
            color: `${colors.textsecondary} !important`
        },
        '.sweet-alert button:hover': {
            'background-color': `${colors.bgsecondary} !important`,
            color: `${colors.textsecondary} !important`
        },
        '.ui-jqgrid .ui-jqgrid-htable th.ui-th-column, .ui-th-column': {
            background: `${colors.bgsurface}`
        },
        '.ui-jqgrid-hdiv': {
            background: `${colors.bgsurface} !important`
        }
    });
    $('<style id="appoverrides">')
        .append(css)
        .appendTo($('head'));
}
