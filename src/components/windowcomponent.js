'use strict';

var code = require('../code'),
    icons = require('../providers/icons').get(),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../../external/jquery')();

/**
 * Window component.
 * @class
 * @private
 * @param {Object} options Window options.
 */
function WindowComponent(options) {

    $ = $ || require('../../external/jquery')();

    this.options = {
        style: 'window-width-full',
        hasParent: false,
        closeBtn: true,
        /** @type {Function} */
        onClose: null
    };

    // Merge options.
    $.extend(this.options, options);

    this.id = util.nextID();
    this.visible = false;
    this.hidden = false;
    this.actions = {};
    /** @type {JQuery} */
    this.main = null;
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
        $('<i class="mdi mdi-close unselectable title-icon"></i>')
            .appendTo(titlebar)
            .click(function() {
                self.options.onClose();
            });
    }

    this.main = $('<div class="window-main" />');

    $('<div id="window' + this.id + '" class="window" />')
        .addClass(this.options.style)
        .append(showTitle ? titlebar : null)
        .append('<div id="actions' + this.id + '" class="actions-bar unselectable" />')
        .append(this.main)
        .appendTo(container);

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
    $('#title' + this.id).html(title);
    return this;
};

/**
 * Add an action button to the window.
 * @param {PageActionMeta} action Window action.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.addAction = function(action) {
    var id = this.id + 'action' + util.nextID();
    var btn = $('<div id="' + id + '" class="action-button unselectable" ' +
        'data-ripple>' + icons.get(action.icon) + ' ' + (action.text || action.name) + '</div>');
    if (action.classname)
        btn.addClass(action.classname);
    btn.ripple();
    $('#actions' + this.id).append(btn);
    this.actions[action.name] = btn;
    return this;
};

/**
 * Get a window action button by name.
 * @param {string} name Name of the button to get.
 * @returns {JQuery} Button as a `JQuery` object. If the button is not found, `null`
 * is returned.
 */
WindowComponent.prototype.action = function(name) {
    return this.actions[name] || null;
};

module.exports = WindowComponent;
