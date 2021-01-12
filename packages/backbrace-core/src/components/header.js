import $ from 'cash-dom';

import { animate } from '../animation';
import { Component } from './component';

import { get as getStyle } from '../providers/style';
import { get as getWindow } from '../providers/window';
import { makeObservable, observable } from 'mobx';

/**
 * @class Header
 * @augments Component
 * @description
 * Header component.
 */
export class Header extends Component {

    /**
     * Component attributes.
     * @static
     * @returns {Map<string,string>} Returns attributes.
     */
    static attributes() {
        return new Map([
            ['logotext', 'string'],
            ['logo', 'string'],
            ['menuicon', 'string']
        ]);
    }

    /**
     * @constructs Header
     */
    constructor() {

        super();

        /**
         * @description
         * App logo text.
         * @type {string}
         */
        this.logotext = '';

        /**
         * @description
         * App logo.
         * @type {string}
         */
        this.logo = '';

        /**
         * @description
         * Menu icon.
         * @type {string}
         */
        this.menuicon = 'menu';

        /**
         * @description
         * Menu element.
         * @type {import('cash-dom').Cash}
         */
        this.menu = null;

        /**
         * @description
         * User information.
         * @type {import('../types').userInfo}
         */
        this.userInfo = null;

        makeObservable(this, {
            userInfo: observable
        });
    }

    /**
     * @description
     * Show the main menu.
     * @returns {Header} Returns itself for chaining.
     */
    showMenu() {
        this.menu.show();
        animate(this.menu[0], {
            left: '0px'
        });
        return this;
    }

    /**
     * @description
     * Hide the main menu.
     * @returns {Header} Returns itself for chaining.
     */
    hideMenu() {
        animate(this.menu[0], {
            left: '-300px'
        }).then(() => this.menu.hide());
        return this;
    }

    /**
     * @override
     */
    firstUpdated() {

        const window = getWindow();

        this.menu = $(this).find('.bb-menu');

        $(window.document).on('click', (event) => {
            if (!$(event.target).closest('.bb-menu-btn').length) {
                this.hideMenu();
            }
        });
    }

    /**
     * @override
     */
    render() {
        return this.html`
            <div class="bb-menu">
                <ul></ul>
            </div>
            <header>
                <nav class="bg-primary text-primary fixed">
                    <div class="bb-nav-inner">
                        <div class="bb-menu-btn clickable" @click=${this.showMenu}>
                            ${getStyle().icon(this.menuicon)}
                        </div>
                        <div class="bb-brand unselectable cuttext" bb-route="/">
                            ${this.logo ?
                this.html`<img class="bb-logo" src=${this.logo} alt=${this.logotext} />` :
                this.html`<div class="bb-logo">${this.logotext}</div>`}
                        </div>
                        <a title=${`Account: ${this.userInfo?.name}
(${this.userInfo?.email})`} role="button">
                            <div class="bb-profile shape-circle" style=${this.styleMap({ display: (!this.userInfo ? 'none' : '') })}>
                                    ${this.userInfo?.initials}
                            </div>
                        </a>
                    </div>
                </nav>
            </header>
        `;
    }
}

Component.define('bb-header', Header);
