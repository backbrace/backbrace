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
        /** @type {Function} */
        menuOnClick: null
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
    this.container.remove();
    if (this.menu)
        this.menu.remove();
};

HeaderComponent.prototype.load = function(container) {

    var self = this;

    this.container = $('<header class="header"></header>').appendTo(container);

    this.navbar = $('<nav class="navbar"><div class="navbar-inner">'
        + '<div id="mnu' + this.id + '" class="menu-icon" data-ripple></div>'
        + '<div id="title' + this.id + '" class="navbar-brand unselectable cuttext">'
        + this.title + '</div>'
        + '</div></nav>').appendTo(this.container);

    // Setup the menu icon.
    $('#mnu' + this.id)
        .html($icons.get(this.settings.menuIcon, 30))
        .ripple()
        .on('click', function() {
            var func = self.settings.menuOnClick || self.showMenu;
            func.call(self);
        });

    if (!this.settings.menuOnClick) {

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
    $('#mnu' + this.id).show();
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
    $('#title' + this.id).html(title);
};

module.exports = HeaderComponent;
