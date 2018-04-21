'use strict';

var code = require('../code'),
    icons = require('../providers/icons').get(),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../external/jquery');

/**
 * Window component.
 * @class
 * @private
 * @param {WindowOptions} options Window options.
 */
function WindowComponent(options) {

    /** @type {WindowOptions} */
    this.options = {
        className: 'window-width-full',
        hasParent: false,
        closeBtn: true,
        icon: null,
        /** @type {Function} */
        onClose: null
    };

    // Merge options.
    $.extend(this.options, options);

    this.id = util.nextID();
    this.visible = false;
    this.hidden = false;
    /** @type {JQuery} */
    this.container = null;
    /** @type {JQuery} */
    this.main = null;
    /** @type {JQuery} */
    this.leftColumn = null;
    /** @type {JQuery} */
    this.rightColumn = null;
    /** @type {JQuery} */
    this.toolbar = null;
}

/**
 * Unload the component.
 * @returns {void}
 */
WindowComponent.prototype.unload = function() {
    // Unload DOM.
    $('#window' + this.id).remove();
};

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.load = function(container) {

    var self = this,
        showTitle = !settings.mobile || this.options.hasParent,
        titlebar = $('<div class="title-bar unselectable" />');

    if (showTitle)
        titlebar.append('<span id="title' + this.id + '" class="title ' +
            (this.options.hasParent ? 'alt' : '') + ' unselectable cuttext" />');

    if (this.options.closeBtn === true && !this.options.hasParent && !settings.mobile) {
        $(icons.get('close'))
            .addClass('unselectable title-icon')
            .appendTo(titlebar)
            .click(function() {
                self.options.onClose();
            });
    }

    this.main = $('<div class="window-main" />');
    this.toolbar = $('<div />');

    this.container = $('<div id="window' + this.id + '" class="window" />')
        .addClass(this.options.className)
        .append(showTitle ? titlebar : null)
        .append(this.toolbar)
        .append(this.main)
        .appendTo(container);

    this.leftColumn = $('<div class="window-column" />')
        .appendTo(this.main);
    this.rightColumn = $('<div class="window-column" />')
        .appendTo(this.main);

    return this;
};

/**
 * Show the window.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.show = function() {

    this.visible = true;

    if (!this.hidden)
        $('#window' + this.id).show();

    return this;
};

/**
 * Hide the window.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.hide = function() {

    this.visible = false;
    $('#window' + this.id).hide();
    return this;
};


/**
 * Set the window's title.
 * @param {string} title Title to set.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.setTitle = function(title) {
    $('#title' + this.id).html(
        (this.options.icon ? icons.get(this.options.icon, null, '#666') + ' ' : '')
        + title);
    return this;
};

module.exports = WindowComponent;
