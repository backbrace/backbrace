import 'modules/roboto-fontface/css/roboto/sass/roboto-fontface.scss';
import '../materialdesign.scss';

import $ from 'jquery';
import { compile } from '../../jss';
import { settings } from '../../settings';

/**
 * Style Load function. Runs after the style sheets have been imported.
 * @returns {void}
 */
export default function load() {

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
        '.main-windows': {
            background: `${colors.bgsurface}`
        },
        '.main-windows-btn.active': {
            'border-bottom': `2px solid ${colors.bgprimary}`,
            color: `${colors.bgprimary}`
        },
        '.viewer-full': {
            background: `${colors.bgsurface}`
        },
        '.mobile-app .actions-bar': {
            'background-color': `${colors.bgsecondary}`,
            '-webkit-box-shadow': `${shadow}`,
            'box-shadow': `${shadow}`
        },
        '.action-button': {
            background: `${colors.bgsecondary}`,
            color: `${colors.textsecondary}`
        },
        '.action-button:hover': {
            background: `${colors.bgsecondaryvar}`,
            color: `${colors.textsecondaryvar}`
        },
        '.control-input:focus': {
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
            'background-color': `${colors.bgsecondaryvar} !important`,
            color: `${colors.textsecondaryvar} !important`
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
