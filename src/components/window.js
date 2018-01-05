'use strict';

var $icons = require('../providers/icons').get(),
    $util = require('../util'),
    $ = require('../../external/jquery'),
    PageAction = require('../classes/pageaction');

/**
 * Window component.
 * @class
 * @param {Object} settings Window settings.
 */
function WindowComponent(settings) {

    this.settings = {
        style: 'window-width-full window-height-half',
        parent: null
    };

    // Merge settings.
    $.extend(this.settings, settings);

    this.id = $util.nextID();
    this.visible = false;
    this.hidden = false;
    this.actions = {};
}

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.load = function(container) {

    var titlebar = $('<div class="title-bar unselectable" />');

    if (!this.settings.parent)
        titlebar.append('<span id="title' + this.id + '" class="title unselectable" />');

    // Add close button.
    //titlebar.append('<i class="fa fa-times title-icon" aria-hidden="true"></i>');

    $('<div id="window' + this.id + '" class="window" />')
        .addClass(this.settings.style)
        .append(titlebar)
        .append('<div id="actions' + this.id + '" class="actions-bar unselectable" />')
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
        $('#window' + this.id).css('display', 'inline-block');

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
 * @param {PageAction} action Window action settings
 * @returns {WindowComponent} Returns itself for chaining.
 */
WindowComponent.prototype.addAction = function(action) {
    var id = this.id + 'action' + $util.nextID();
    var btn = $('<div id="' + id + '" class="action-button unselectable" ' +
        'data-ripple>' + $icons.get(action.icon) + ' ' + action.text + '</div>');
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
