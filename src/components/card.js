'use strict';

var $code = require('../code'),
    WindowComponent = require('./window'),
    Page = require('../classes/page'),
    PageTab = require('../classes/pagetab');

/**
 * Card component class.
 * @class
 */
function CardComponent() {
    /**
     * Page meta data.
     * @type {Page}
     */
    this.page = null;
}

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @param {Page} page Page meta data to load.
 * @returns {JQueryPromise} Promise to load the card.
 */
CardComponent.prototype.load = function(container, page) {

    this.page = page;

    return $code.block(
        function loadPageTabs() {
            return loadTabs(page.tabs, container);
        }
    );
};

/**
 * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
 * @param {PageTab[]} tabs Tabs to load.
 * @param {JQuery} container Container to load the tabs into.
 * @returns {JQueryPromise} Promise to return after we load the tabs.
 */
function loadTabs(tabs, container) {
    return $code.each(tabs, function loadTab(/** @type {PageTab} */tab) {
        if (tab.pageName === '') { // Not a sub page.
            var win = new WindowComponent({});
            win.load(container).setTitle(tab.text).show();
        }
    });
}

module.exports = CardComponent;
