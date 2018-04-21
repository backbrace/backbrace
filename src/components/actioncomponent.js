'use strict';

var code = require('../code'),
    icons = require('../providers/icons').get(),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../external/jquery');

/**
 * Action button component.
 * @class
 * @private
 * @param {PageActionMeta} action Action meta data.
 * @param {Function} runfunc Run action function.
 */
function ActionComponent(action, runfunc) {
    this.id = util.nextID();
    this.action = action;
    this.onrun = runfunc;
    /** @type {Function} */
    this.onclick = null;
    /** @type {JQuery} */
    this.button = null;
}

/**
 * Unload the component.
 * @returns {void}
 */
ActionComponent.prototype.unload = function() {
};

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {ActionComponent} Returns itself for chaining.
 */
ActionComponent.prototype.load = function(container) {

    var self = this;

    this.button = $('<div id="' + this.id + '" class="action-button unselectable" ' +
        'data-ripple>' + (settings.mobile ? icons.get(this.action.icon, '2em') + '<br/>' : ' ') +
        this.action.text + '</div>');
    if (settings.mobile)
        this.button.addClass('cuttext');
    if (this.action.className)
        this.button.addClass(this.action.className);
    this.button.ripple().click(function() {
        self.onrun(self.action, self.onclick);
    });
    container.append(this.button);
    return this;
};

ActionComponent.prototype.click = function(func) {
    this.onclick = func;
};

ActionComponent.prototype.show = function() {
    this.button.show();
};

ActionComponent.prototype.hide = function() {
    this.button.hide();
};

module.exports = ActionComponent;
