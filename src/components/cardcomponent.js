'use strict';

var code = require('../code'),
    settings = require('../settings'),
    util = require('../util'),
    PageComponent = require('./pagecomponent'),
    WindowComponent = require('./windowcomponent'),
    $ = require('../external/jquery');

/**
 * Card component class.
 * @class
 * @private
 * @param {PageComponent} parent Parent page component.
 */
function CardComponent(parent) {
    this.id = util.nextID();
    this.parent = parent;
    /** @type {WindowComponent[]} */
    this.subwindows = {};
    /** @type {PageComponent[]} */
    this.subpages = {};
    /** @type {Component[]} */
    this.controls = {};
}

/**
 * Unload the component.
 * @returns {void}
 */
CardComponent.prototype.unload = function() {

    // Unload sub components.
    this.parent = null;

    $.each(this.subwindows, function(index, win) {
        win.unload();
    });
    this.subwindows = null;

    $.each(this.subpages, function(index, page) {
        page.unload();
    });
    this.subpages = null;

    $.each(this.controls, function(index, cont) {
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
        function loadMainTab() {
            return self.loadFields('');
        },
        function loadPageTabs() {
            return self.loadTabs();
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

    return code.each(page.tabs, function loadTab(tab) {

        // Check if the tab is mobile or desktop only.
        if (settings.mobile && tab.desktopOnly)
            return;
        if (!settings.mobile && tab.mobileOnly)
            return;

        var cont = self.parent.mainContainer,
            classes = 'window-width-full';
        if (tab.factbox && !settings.mobile) {
            cont = self.parent.sideContainer;
            classes = 'window-width-full single-column';
            self.parent.showSide();
        }

        if (tab.pageName === '') { // Not a sub page.

            // Create the window.
            var win = new WindowComponent({
                className: classes,
                hasParent: true,
                icon: tab.icon
            });
            win.load(cont)
                .setTitle(tab.text);

            self.subwindows[tab.name] = win;
            return self.loadFields(tab.name);

        } else {

            if (!settings.mobile) {

                // Create sub page.
                var page = new PageComponent(tab.pageName, {
                    hasParent: true
                });
                self.subpages[tab.name] = page;
                return page.load(cont);
            }
        }
    });
};

CardComponent.prototype.loadFields = function(tab) {

    var self = this,
        page = self.parent.page,
        left = false,
        fields = $.grep(page.fields, function(field) {
            return field.tab === tab;
        }),
        half = Math.round(fields.length / 2);

    return code.each(fields, function loadField(field, i) {

        // Check if the field is mobile or desktop only.
        if ((settings.mobile && field.desktopOnly) ||
            (!settings.mobile && field.mobileOnly))
            field.hidden = true;

        var comp = field.component,
            win = self.parent.window;

        if (tab !== '' && self.subwindows[tab])
            win = self.subwindows[tab];

        left = false;
        if (typeof i === 'number' && i + 1 <= half || field.leftColumn)
            left = true;
        if (field.rightColumn)
            left = false;

        if (comp === '') {
            comp = 'textboxcomponent';
        }
        if (comp.indexOf('.js') === -1) {

            var Control = require('./controls/' + comp + '.js');

            /** @type {Component} */
            var cont = new Control(self, field);
            self.controls[field.name] = cont;

            win.leftColumn.show();
            win.rightColumn.show();

            return cont.load(left ? win.leftColumn :
                win.rightColumn);
        }
    });
};

/**
 * Show the card component.
 * @returns {CardComponent} Returns itself for chaining.
 */
CardComponent.prototype.show = function() {

    // Show the sub pages.
    $.each(this.subpages, function(index, page) {
        page.show();
    });

    // Show the sub windows.
    $.each(this.subwindows, function(index, win) {
        win.show();
    });

    return this;
};

/**
 * Hide the card component.
 * @returns {CardComponent} Returns itself for chaining.
 */
CardComponent.prototype.hide = function() {

    // Hide the sub pages.
    $.each(this.subpages, function(index, page) {
        page.hide();
    });

    // Hide the sub windows.
    $.each(this.subwindows, function(index, win) {
        win.hide();
    });

    return this;
};

module.exports = CardComponent;
