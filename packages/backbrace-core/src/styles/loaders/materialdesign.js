import '../materialdesign/materialdesign.scss';

import $ from 'cash-dom';
import ripplet from 'ripplet.js';
import Swal from 'sweetalert2';

import { compile } from '../../jss';
import { MaterialDesignSpinner } from '../components/mdspinner';
import { settings } from '../../settings';

import { StyleHandler } from '../../providers/style';
import { get as getWindow } from '../../providers/window';

/**
 * Material design style.
 * @class MaterialDesignStyle
 * @augments StyleHandler
 * @private
 */
export default class MaterialDesignStyle extends StyleHandler {

    /**
     * @override
     */
    load() {

        // Load the style overrides.
        const colors = settings.style.colors;
        let css = compile({
            // Add Colors.
            'body': {
                background: `${colors.bgbody}`,
                color: `${colors.textbody}`
            },
            'bb-apptoolbar .bb-button.active': {
                'border-bottom': `2px solid ${colors.bgprimary}`,
                background: `${colors.bghover}`,
                color: `${colors.bgprimary}`
            },
            'bb-textbox .bb-field-focus': {
                'color': `${colors.bgprimary}`
            },
            '.sweet-alert button': {
                'background-color': `${colors.bgsecondary} !important`,
                color: `${colors.textsecondary} !important`
            },
            '.sweet-alert button:hover': {
                'background-color': `${colors.bgsecondary} !important`,
                color: `${colors.textsecondary} !important`
            }
        });
        $(`<style id="appoverrides">${css}</style>`).appendTo('head');
    }

    /**
     * @override
     */
    progress() {
        return new MaterialDesignSpinner();
    }

    /**
     * @override
     */
    pageUpdated(page) {
        $(page).find('.clickable').each((i, ele) => {
            ele.addEventListener('mousedown', ripplet);
        }).removeClass('clickable');
    }

    /**
     * @override
     */
    async message(msg, title) {
        await Swal.fire(title, msg);
    }

    /**
     * @override
     */
    icon(name) {

        const window = getWindow();

        let i = window.document.createElement('i');
        i.classList.add('material-icons');
        i.innerText = name;

        return i;
    }

}
