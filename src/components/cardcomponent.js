'use strict';

var code = require('../code'),
    settings = require('../settings'),
    util = require('../util'),
    PageComponent = require('./pagecomponent'),
    WindowComponent = require('./windowcomponent');

/**
 * Card component class.
 * @class
 * @private
 * @param {PageComponent} parent Parent page component.
 */
function CardComponent(parent) {
    this.id = util.nextID();
    this.parent = parent;
    this.subwindows = {};
    this.controls = {};
}

/**
 * Unload the component.
 * @returns {void}
 */
CardComponent.prototype.unload = function() {
    // Unload sub components.
    this.parent = null;
    util.forEach(this.subwindows, function unloadSubWindows(/** @type {WindowComponent} */win) {
        win.unload();
    });
    this.subwindows = null;
    util.forEach(this.controls, function unloadControls(/** @type {Component} */cont) {
        cont.unload();
    });
    this.controls = null;
};

/**
 * Load the component.
 * @returns {JQueryPromise} Promise to load the card.
 */
CardComponent.prototype.load = function() {
    var self = this;
    return code.block(
        function loadPageTabs() {
            return self.loadTabs();
        },
        function loadPageFields() {
            return self.loadFields();
        }
    );
};

/**
 * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
 * @returns {JQueryPromise} Promise to return after we load the tabs.
 */
CardComponent.prototype.loadTabs = function() {

    var self = this,
        page = self.parent.page;

    return code.each(page.tabs, function loadTab(/** @type {PageTabMeta} */tab) {

        // Check if the tab is mobile or desktop only.
        if (settings.mobile && tab.desktopOnly)
            return;
        if (!settings.mobile && tab.mobileOnly)
            return;

        if (tab.pageName === '') { // Not a sub page.

            var cont = self.parent.mainContainer;
            if (tab.factbox && !settings.mobile) {
                cont = self.parent.sideContainer;
                self.parent.showSide();
            }

            // Create the window.
            var win = new WindowComponent({
                hasParent: true
            });
            win.load(cont).setTitle(tab.text);
            self.subwindows[tab.name] = win;
        }
    });
};

CardComponent.prototype.loadFields = function() {

    var self = this,
        page = self.parent.page;

    return code.each(page.fields, function loadField(/** @type {PageFieldMeta} */field) {

        // Check if the field is mobile or desktop only.
        if (settings.mobile && field.desktopOnly)
            return;
        if (!settings.mobile && field.mobileOnly)
            return;

        var comp = field.component;
        if (comp === '') {
            comp = 'textboxcomponent';
        }
        if (comp.indexOf('.js') === -1) {

            var Control = require('./controls/' + comp + '.js');

            /** @type {Component} */
            var cont = new Control(self, field);
            self.controls[field.name] = cont;
            return cont.load(self.parent.window.main);
        }
    });
};

/**
 * Show the card component.
 * @returns {CardComponent} Returns itself for chaining.
 */
CardComponent.prototype.show = function() {
    // Show the sub windows.
    util.forEach(this.subwindows,
        function(/** @type {WindowComponent} */win) {
            win.show();
        });
    return this;
};

/**
 * Hide the card component.
 * @returns {CardComponent} Returns itself for chaining.
 */
CardComponent.prototype.hide = function() {
    // Hide the sub windows.
    util.forEach(this.subwindows,
        function(/** @type {WindowComponent} */win) {
            win.hide();
        });
    return this;
};

module.exports = CardComponent;
