import $ from 'cash-dom';

import { animate, fadeIn } from '../animation';
import { Component } from './component';

import { get as getStyle } from '../providers/style';
import { get as getWindow } from '../providers/window';
import { makeObservable, observable } from 'mobx';
import { settings } from '../settings';
import { auth } from '../data';

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
         * Profile menu element.
         * @type {import('cash-dom').Cash}
         */
        this.profileMenu = null;

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
     * Show the profile menu.
     * @param {Event} ev Event.
     * @returns {Header} Returns itself for chaining.
     */
    showProfileMenu(ev) {
        if (this.profileMenu.css('display') !== 'none')
            return;
        this.profileMenu.show();
        fadeIn(this.profileMenu[0], 50);
        ev.stopPropagation();
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
     * @description
     * Hide the main menu.
     * @returns {Header} Returns itself for chaining.
     */
    hideProfileMenu() {
        this.profileMenu.hide();
        return this;
    }

    /**
     * @override
     */
    firstUpdated() {

        const window = getWindow();

        this.menu = $(this).find('.bb-menu');
        this.profileMenu = $(this).find('.bb-profile-menu');

        $(window.document).on('click', (event) => {
            if (!$(event.target).closest('.bb-menu-btn').length) {
                this.hideMenu();
            }
            this.hideProfileMenu();
        });
    }

    /**
     * Logout of the app.
     * @returns {void}
     */
    logout() {
        this.hide();
        auth.token = '';
        auth.userID = '';
    }

    /**
     * @override
     */
    render() {
        const userImageStyle = this.userInfo?.image ? {
            'background-image': `url("${this.userInfo?.image}")`,
            'background-size': 'cover',
            'background-position': 'center center'
        } : {};
        return this.html`
            <div class="bb-menu">
                <ul></ul>
            </div>
            <div class="bb-profile-menu">
                <div class="bb-profile-section">
                    <div class="bb-profile bb-profile-large shape-circle" style=${this.styleMap(userImageStyle)}>
                        ${this.userInfo?.image ? '' : this.userInfo?.initials}
                    </div>
                    <h6>${this.userInfo?.name}</h6>
                    <span>${this.userInfo?.email}</span>
                    <button class="bb-button">Manage your Account</button>
                </div>
                ${settings.auth.logout ? this.html`<div class="bb-logout-section">
                    <button class="bb-button" @click=${this.logout} bb-route="${settings.auth.logout}">Sign Out</button>
                </div>` : ''}
            </div>
            <header>
                <nav class="fixed">
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
                            <div class="bb-profile shape-circle" @click=${this.showProfileMenu}
                                style=${this.styleMap({ display: (!this.userInfo ? 'none' : ''), ...userImageStyle })}>
                                    ${this.userInfo?.image ? '' : this.userInfo?.initials}
                            </div>
                        </a>
                    </div>
                </nav>
            </header>
        `;
    }
}

Component.define('bb-header', Header);
