'use strict';

var code = require('../../code'),
    settings = require('../../settings'),
    util = require('../../util'),
    $ = require('../../../external/jquery')();

/**
 * Textbox component class.
 * @class
 * @private
 * @param {Component} parent Parent component.
 * @param {PageFieldMeta} field Field meta data.
 */
function TextboxComponent(parent, field) {
    this.id = util.nextID();
    this.parent = parent;
    this.field = field;
    /** @type {JQuery} */
    this.container = null;
    /** @type {JQuery} */
    this.control = null;
    /** @type {JQuery} */
    this.label = null;
}

/**
 * Load the component.
 * @param {JQuery} container Conatiner to load into.
 * @returns {void}
 */
TextboxComponent.prototype.load = function(container) {
    var type = 'text';
    if (this.field.password)
        type = 'password"';
    this.container = $('<div class="control-container">')
        .appendTo(container);
    this.label = $('<label for="cont' + this.id + '" class="control-label"></label>')
        .text(this.field.caption)
        .appendTo(this.container);
    this.control = $('<input id="cont' + this.id + '" type="' + type +
        '" class="control-input"></input>')
        .appendTo(this.container);
};

TextboxComponent.prototype.unload = function(container) {

    // Unload DOM.
    this.container.remove();

    this.container = null;
    this.control = null;
    this.label = null;
};

TextboxComponent.prototype.show = function(container) {
    this.container.show();
};

TextboxComponent.prototype.hide = function(container) {
    this.container.hide();
};

module.exports = TextboxComponent;
