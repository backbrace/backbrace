'use strict';

var $code = require('../code'),
    $controller = require('../controller'),
    $meta = require('../meta'),
    $settings = require('../settings'),
    $util = require('../util'),
    $ = require('../../external/jquery')(),
    Page = require('../classes/page'),
    CardComponent = require('./cardcomponent'),
    WindowComponent = require('./windowcomponent');

/**
 * Page component. Used to display a page.
 * @class
 * @param {string} name Page name.
 * @param {Object} settings Page Settings.
 */
function PageComponent(name, settings) {

    $ = $ || require('../../external/jquery')();

    /**
     * Unique ID of the page component.
     * @type {number}
     */
    this.id = $util.nextID();

    /**
     * Name of the page.
     * @type {string}
     */
    this.name = name;

    /**
     * Page component settings.
     * @type {Object}
     */
    this.settings = {
        factbox: false
    };

    // Merge settings.
    $.extend(this.settings, settings);

    /**
     * Page meta data.
     * @type {Page}
     */
    this.page = null;

    /**
     * The page's window component.
     * @type {WindowComponent}
     */
    this.window = new WindowComponent({});

    /**
     * The component that renders over the entire window.
     * @type {CardComponent}
     */
    this.pageComponent = null;

    /**
     * Main container.
     * @type {JQuery}
     */
    this.mainContainer = null;

    /**
     * Side container.
     * @type {JQuery}
     */
    this.sideContainer = null;
}

/**
 * Unload the component.
 * @returns {void}
 */
PageComponent.prototype.unload = function() {
    // Unload sub components.
    this.pageComponent.unload();
    this.pageComponent = null;
    this.window.unload();
    this.window = null;
    // Unload DOM.
    this.mainContainer.remove();
    this.sideContainer.remove();
};

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {JQueryPromise} Promise to load the page.
 */
PageComponent.prototype.load = function(container) {

    var self = this,
        $app = require('../app');

    this.mainContainer = $('<div class="main-container"></div>')
        .appendTo(container);
    this.sideContainer = $('<div class="side-container"></div>')
        .appendTo(container);

    return $code.block(

        function getMetadata() {
            // Get the page meta data.
            return $meta.page(self.name);
        },

        /**
         * @param {Page} page Page meta data.
         * @returns {void|JQueryPromise} Promise to return after we load the component.
         */
        function loadComponent(page) {

            // Page meta data not found.
            if (page === null)
                $app.error('Cannot find page meta data: {0}', self.name);

            self.page = page;

            // Load into main or side container?
            var cont = self.mainContainer;
            if ((self.settings.factbox === true || $util.hasOption(page.options, 'factbox'))
                && !$settings.mobile)
                cont = self.sideContainer;

            // Load the window and set the title.
            self.window.load(cont).setTitle(page.caption);

            // Add close function.
            self.window.settings.onClose = function() {
                $code.thread(function closePage() {
                    return $app.component().closePage(self.id);
                });
            };

            // Add actions.
            $.each(page.actions, function(i, action) {
                self.window.addAction(action);
            });

            if (page.type === 'Card') {
                self.pageComponent = new CardComponent(self);
                return self.pageComponent.load();
            }
        },

        function getController() {

            // Get the page contoller (from file).
            if (self.page.controller !== '')
                return $controller.load(self.page.controller);
        },

        function executeController() {

            // Execute the controller.
            if (self.page.controller !== '')
                $controller.get(self.page.controller)(self);

            // Show the window.
            self.window.show();
        }

    );
};

PageComponent.prototype.showSide = function() {
    this.sideContainer.css('display', 'inline-block');
    this.mainContainer.css('width', '70%');
};

module.exports = PageComponent;
