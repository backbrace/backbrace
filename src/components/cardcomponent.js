'use strict';

var $code = require('../code'),
    $settings = require('../settings'),
    $util = require('../util'),
    PageComponent = require('./pagecomponent'),
    WindowComponent = require('./windowcomponent'),
    PageTab = require('../classes/pagetab');

/**
 * Card component class.
 * @class
 * @param {PageComponent} parent Parent page component.
 */
function CardComponent(parent) {
    /**
     * Parent page component.
     * @type {PageComponent}
     */
    this.parent = parent;

    /**
     * Sub windows.
     * @type {WindowComponent[]}
     */
    this.subwindows = [];
}

/**
 * Unload the component.
 * @returns {void}
 */
CardComponent.prototype.unload = function() {
    // Unload sub components.
    this.parent = null;
    $util.forEach(this.subwindows, function unloadSubWindows(/** @type {WindowComponent} */win) {
        win.unload();
    });
    this.subwindows = null;
};

/**
 * Load the component.
 * @returns {JQueryPromise} Promise to load the card.
 */
CardComponent.prototype.load = function() {
    var self = this;
    return $code.block(
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

    var self = this;

    return $code.each(self.parent.page.tabs, function loadTab(/** @type {PageTab} */tab) {

        // Check if the tab is mobile or desktop only.
        if ($settings.mobile && $util.hasOption(tab.options, 'desktoponly'))
            return;
        if (!$settings.mobile && $util.hasOption(tab.options, 'mobileonly'))
            return;

        if (tab.pageName === '') { // Not a sub page.

            var cont = self.parent.mainContainer;
            if ($util.hasOption(tab.options, 'factbox') && !$settings.mobile) {
                cont = self.parent.sideContainer;
                self.parent.showSide();
            }

            // Create the window.
            var win = new WindowComponent({
                hasParent: true
            });
            win.load(cont).setTitle(tab.text);
            self.subwindows.push(win);
        }
    });
};

/**
 * Show the card component.
 * @returns {CardComponent} Returns itself for chaining.
 */
CardComponent.prototype.show = function() {
    // Show the sub windows.
    $util.forEach(this.subwindows,
        function(/** @type {WindowComponent} */win) {
            win.show();
        });
    return this;
};

module.exports = CardComponent;
