'use strict';

var $settings = require('../settings'),
    $ = require('../../external/jquery')();

/**
 * Header component.
 * @class
 * @private
 */
function HeaderComponent() {

    $ = $ || require('../../external/jquery')();

    this.menuExtended = false;
}

HeaderComponent.prototype.load = function(container) {

    var self = this;

    $('<header class="header">'
        + '<nav class="navbar"><div class="navbar-inner">'
        + '<div class="menu-icon" data-ripple><div class="menu-icon-bar1" />'
        + '<div class="menu-icon-bar2" /><div class="menu-icon-bar3" /></div>'
        + '<h1 class="navbar-brand"><img class="navbar-logo" /></h1>'
        + '</div></nav></header>'
        + '<div class="menu" >'
        + '<div class="menu-brand"><img class="menu-logo" /></div>'
        + '<ul id="mnuMain" /></div>').appendTo(container);

    // Add profile image.
    if ($settings.mobile) {
        $('.menu-logo').remove();
        $('.menu-brand').append('<img id="imgProfile" class="circle-img profile-img" />');
    } else {
        $('.menu-logo').attr('src', $settings.style.images.menuLogo);
        $('.navbar-inner').append('<img id="imgProfile" class="circle-img profile-img" />');
    }

    $('.navbar-logo').attr('src', $settings.style.images.logo);

    $('.menu-icon').ripple().on('click', function() {
        $('.menu').show().animate({
            left: '0px'
        }, null, function() {
            self.menuExtended = true;
        });
    });

    $(window.document).on('click', function(event) {
        if (!$(event.target).closest('.menu-icon').length) {
            $('.menu').animate({
                left: '-300px'
            }, null, function() {
                $('.menu').hide();
                self.menuExtended = false;
            });
        }
    });
};

HeaderComponent.prototype.loadMenu = function() {
    $('.menu-icon').show();
};

HeaderComponent.prototype.loadProfileImage = function(url) {
    $('#imgProfile').show().attr('src', url);
};

module.exports = HeaderComponent;
