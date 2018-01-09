'use strict';

var $icons = require('../providers/icons').get(),
    $settings = require('../settings'),
    $util = require('../util'),
    $ = require('../../external/jquery')();

/**
 * Header component.
 * @class
 * @param {Object} settings Header settings.
 */
function HeaderComponent(settings) {

    $ = $ || require('../../external/jquery')();

    this.settings = {
        menuIcon: 'menu',
        attachMenu: true
    };

    // Merge settings.
    $.extend(this.settings, settings);

    this.id = $util.nextID();

    /**
     * @type {JQuery}
     */
    this.navbar = null;

    /**
     * @type {JQuery}
     */
    this.menu = null;

    /**
     * @type {JQuery}
     */
    this.menuIcon = null;

    /**
     * @type {JQuery}
     */
    this.titleBar = null;

    /**
     * @type {JQuery}
     */
    this.profileImage = null;

    this.menuExtended = false;

    /**
     * @type {JQuery}
     */
    this.container = null;

    this.title = '';
}

HeaderComponent.prototype.unload = function() {
    // Unload the DOM.
    this.menuIcon.remove();
    this.menuIcon = null;
    this.container.remove();
    this.container = null;
};

HeaderComponent.prototype.load = function(container) {

    var self = this;

    this.container = $('<header class="header"></header>').appendTo(container);

    this.navbar = $('<nav class="navbar"><div class="navbar-inner">'
        + '</div></nav>').appendTo(this.container);

    // Setup the menu icon.
    this.menuIcon = $('<div class="menu-icon" data-ripple></div>')
        .appendTo(this.navbar.children())
        .html($icons.get(this.settings.menuIcon, 30))
        .ripple();

    // Setup title bar.
    this.titleBar = $('<div class="navbar-brand unselectable cuttext">'
        + this.title + '</div>').appendTo(this.navbar.children());

    if (this.settings.attachMenu) {

        // Add a menu.
        this.menu = $('<div class="menu">'
            + '<div class="menu-brand">'
            + (!$settings.mobile && $settings.style.images.menuLogo !== '' ?
                '<img class="menu-logo" src="' + $settings.style.images.menuLogo + '" />' :
                '')
            + '</div>'
            + '<ul id="mnuMain" /></div>').appendTo(this.container);

        // Add profile image.
        this.profileImage = $('<img class="circle-img profile-img" />')
            .appendTo($settings.mobile ? $('.menu-brand') : $('.navbar-inner'));

        $(window.document).on('click', function(event) {
            if (!$(event.target).closest('.menu-icon').length) {
                self.hideMenu();
                event.preventDefault();
                return false;
            }
        });
    }
};

HeaderComponent.prototype.loadMenu = function() {
};

HeaderComponent.prototype.loadProfileImage = function(url) {
    this.profileImage.show().attr('src', url);
};

HeaderComponent.prototype.showMenu = function() {
    var self = this;
    this.menu.show().animate({
        left: '0px'
    }, null, function() {
        self.menuExtended = true;
    });
};

HeaderComponent.prototype.hideMenu = function() {
    var self = this;
    this.menu.animate({
        left: '-300px'
    }, null, function() {
        self.menu.hide();
        self.menuExtended = false;
    });
};

HeaderComponent.prototype.setTitle = function(title) {
    this.title = title;
    if (this.titleBar)
        this.titleBar.html(title);
};

module.exports = HeaderComponent;
