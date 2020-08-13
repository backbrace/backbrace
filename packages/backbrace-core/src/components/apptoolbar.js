import $ from 'cash-dom';

import { app } from '../app';
import { fadeIn } from '../animation';
import { Component } from './component';

import { get as getStyle } from '../providers/style';

/**
 * @class AppToolbar
 * @augments Component
 * @description
 * App toolbar component.
 */
export class AppToolbar extends Component {

    /**
     * @constructs AppToolbar
     */
    constructor() {

        super();

        /**
         * @description
         * Window toolbar buttons.
         * @type {Map<number,import('cash-dom').Cash>}
         */
        this.buttons = new Map();
    }

    /**
     * Add a button to the toolbar.
     * @param {import('./page').Page} page Page to add.
     * @returns {import('cash-dom').Cash} Returns the button.
     */
    addButton(page) {

        this.deselectButtons();

        const style = getStyle(),
            closeBtn = $(style.icon('close'))
                .on('click', (ev) => {
                    app.closePage(page.uid);
                    ev.preventDefault();
                    return false;
                });

        let btn = $('<div class="bb-button unselectable"></div>')
            .css('opacity', 0)
            .appendTo(this)
            .append(`<span>${page.design.caption || page.name}</span>`)
            .append(closeBtn)
            .on('click', () => {
                app.showPage(page.uid);
            });

        this.buttons.set(page.uid, btn);
        fadeIn(btn[0], 300).then(() => this.selectButton(page.uid));
        return btn;
    }

    /**
     * Remove a button from the toolbar.
     * @param {number} uid Page id.
     * @returns {void}
     */
    removeButton(uid) {
        let btn = this.buttons.get(uid);
        if (btn) {
            btn.remove();
            this.buttons.delete(uid);
        }
    }

    /**
     * Deselect all toolbar buttons.
     * @returns {void}
     */
    deselectButtons() {
        this.buttons.forEach(b => b.removeClass('active'));
    }

    /**
     * Select a button from the toolbar.
     * @param {number} uid Page id.
     * @returns {void}
     */
    selectButton(uid) {
        this.deselectButtons();
        let btn = this.buttons.get(uid);
        if (btn)
            btn.addClass('active');
    }

    /**
     * @override
     */
    render() {
        return this.html``;
    }

}

Component.define('bb-apptoolbar', AppToolbar);
