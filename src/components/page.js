'use strict';

var $app = require('../app'),
    $code = require('../code'),
    $controller = require('../controller'),
    $meta = require('../meta'),
    $ = require('../../external/jquery'),
    Page = require('../classes/page'),
    CardComponent = require('./card'),
    WindowComponent = require('./window');

/**
 * Page component. Used to display a page.
 * @class
 * @param {string} name - Page name.
 */
function PageComponent(name) {
    this.name = name;
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
}

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {JQueryPromise} Promise to load the page.
 */
PageComponent.prototype.load = function(container) {

    var self = this;

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

            // Load the window and set the title.
            self.window.load(container).setTitle(page.caption);

            // Add actions.
            $.each(page.actions, function(i, action) {
                self.window.addAction(action);
            });

            if (page.type === 'Card') {
                self.pageComponent = new CardComponent();
                return self.pageComponent.load(container, page);
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

module.exports = PageComponent;
