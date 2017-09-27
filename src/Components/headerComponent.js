'use strict';

/**
 * Header component.
 * @param {JQuery} container - DOM container.
 */
function HeaderComponent() {
    this.menuExtended = false;
    this.logo = $app.settings.images.logo;
    this.menuLogo = $app.settings.images.menuLogo;
}

HeaderComponent.template = '<header class="header">'
    + '<nav class="navbar"><div class="navbar-inner">'
    + '<div class="menu-icon" data-ripple><div class="menu-icon-bar1" />'
    + '<div class="menu-icon-bar2" /><div class="menu-icon-bar3" /></div>'
    + '<h1 class="navbar-brand"><img class="navbar-logo" src="{{logo}}" /></h1>'
    + '</div></nav></header>'
    + '<div class="menu" >'
    + '<div class="menu-brand"><img class="menu-logo" src="{{menuLogo}}" /></div>'
    + '<ul id="mnuMain" /></div>';

HeaderComponent.prototype.load = function(container) {

    var _self = this;

    // Load components.
    $js.mergeTemplate(HeaderComponent.template, this).appendTo(container);

    // Add profile image.
    if ($js.mobile) {
        $('.menu-logo').remove();
        $('.menu-brand').append('<img id="imgProfile" class="circle-img profile-img" />');
    } else {
        $('.navbar-inner').append('<img id="imgProfile" class="circle-img profile-img" />');
    }

    $('.menu-icon').ripple().on('click', function() {
        $('.menu').show().animate({
            left: '0px'
        }, null, function() {
            _self.menuExtended = true;
        });
    });

    $($window.document).on('click', function(event) {
        if (!$(event.target).closest('.menu-icon').length) {
            $('.menu').animate({
                left: '-300px'
            }, null, function() {
                $('.menu').hide();
                _self.menuExtended = false;
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
