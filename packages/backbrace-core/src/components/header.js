import $ from 'cash-dom';

import { animate, fadeIn } from '../animation';
import { Component } from './component';

import { get as getStyle } from '../providers/style';
import { get as getWindow } from '../providers/window';
import { settings } from '../settings';
import { appState } from '../state';
import { isMobileDevice } from '../util';

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
         * Attribute. App logo text.
         * @type {string}
         */
        this.logotext = '';

        /**
         * @description
         * Attribute. App logo.
         * @type {string}
         */
        this.logo = '';

        /**
         * @description
         * Attribute. Menu icon.
         * @type {string}
         */
        this.menuicon = 'menu';

        /**
         * @description
         * Menu element.
         * @type {import('cash-dom').Cash}
         */
        this.menu = null;

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
        const profileMenu = $(this).find('.bb-profile-menu');
        if (profileMenu.css('display') !== 'none')
            return;
        profileMenu.show();
        fadeIn(profileMenu[0], 50);
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
        $(this).find('.bb-profile-menu').hide();
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
            this.hideProfileMenu();
        });
    }

    /**
     * Logout of the app.
     * @returns {void}
     */
    logout() {
        this.hide();
        appState.auth = null;
        appState.user = null;
    }

    /**
     * @override
     */
    render() {

        const user = appState.user;

        const imageStyle = user?.image ? {
            'background-image': `url("${user?.image}")`,
            'background-size': 'cover',
            'background-position': 'center center'
        } : {};

        const profile = this.html`
            <div class="bb-profile-section">
                <div class="bb-profile bb-profile-large shape-circle" style=${this.styleMap(imageStyle)}>
                    ${user?.image ? '' : user?.initials}
                </div>
                <h6>${user?.name}</h6>
                <span>${user?.email}</span>
                <bb-button caption="Manage your Account" class="bb-button-outlined"></bb-button>
            </div>
            ${settings.auth.logout ? this.html`<div class="bb-logout-section">
                <bb-button caption="Sign Out" class="bb-button-outlined" @click=${this.logout} bb-route="${settings.auth.logout}"></bb-button>
            </div>` : ''}
        `;

        const profileIcon = this.html`
        <a title=${`Account: ${user?.name}
(${user?.email})`} role="button">
            <div class="bb-profile shape-circle" style=${this.styleMap(imageStyle)} @click=${this.showProfileMenu}>
                ${user?.image ? '' : user?.initials}
            </div>
        </a>`;

        return this.html`
            <div class="bb-menu">
                ${user && isMobileDevice() ? profile : ''}
                ${!isMobileDevice() ? this.html`
                <h6>${settings.app.name}</h6>
                ${user ? this.html`<span>${user?.email}</span>` : ''}
                ` : ''}
                <ul></ul>
            </div>
            ${user && !isMobileDevice() ? this.html`<div class="bb-profile-menu">${profile}</div>` : ''}
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
                        ${user && !isMobileDevice() ? profileIcon : ''}
                    </div>
                </nav>
            </header>
        `;
    }
}

Component.define('bb-header', Header);
