'use strict';

var code = require('../code'),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../external/jquery'),
    ActionComponent = require('./actioncomponent');

/**
 * Actions bar component.
 * @class
 * @private
 */
function ActionsComponent() {
    this.id = util.nextID();
    /** @type {JQuery} */
    this.bar = null;
    /** @type {ActionComponent[]} */
    this.actions = {};
}

/**
 * Unload the component.
 * @returns {void}
 */
ActionsComponent.prototype.unload = function() {
    $.each(this.actions, function(index, btn) {
        btn.unload();
    });
    this.bar.remove();
};

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {ActionsComponent} Returns itself for chaining.
 */
ActionsComponent.prototype.load = function(container) {
    this.bar = $('<div class="actions-bar unselectable" />')
        .appendTo(container);
    return this;
};

/**
 * Add an action button to the window.
 * @param {PageActionMeta} action Window action.
 * @param {Function} runfunc Run action function.
 * @returns {ActionsComponent} Returns itself for chaining.
 */
ActionsComponent.prototype.addAction = function(action, runfunc) {
    var btn = new ActionComponent(action, runfunc);
    btn.load(this.bar);
    this.actions[action.name] = btn;
    return this;
};

/**
 * Get a window action by name.
 * @param {string} name Name of the action to get.
 * @returns {ActionComponent} Return the action. If the action is not found, `null`
 * is returned.
 */
ActionsComponent.prototype.action = function(name) {
    return this.actions[name] || null;
};

ActionsComponent.prototype.show = function() {
    if (settings.mobile) {
        this.bar.show().animate({
            bottom: 60 - this.bar.height()
        });
    } else {
        this.bar.show();
    }
};

ActionsComponent.prototype.hide = function() {
    this.bar.hide();
};

module.exports = ActionsComponent;
