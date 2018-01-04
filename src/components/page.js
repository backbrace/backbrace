'use strict';

var $app = require('../app'),
    $code = require('../code'),
    $controller = require('../controller'),
    $meta = require('../meta'),
    $ = require('../../external/jquery'),
    Page = require('../classes/page'),
    WindowComponent = require('./window');

/**
 * Page component. Used to display a page.
 * @class
 * @param {string} name - Page name.
 */
function PageComponent(name) {
    this.name = name;
    /** @type {Page} */
    this.page = null;
    this.window = new WindowComponent({});
}

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {JQueryPromise} Promise to load the page.
 */
PageComponent.prototype.load = function(container) {

    var self = this;

    return $code.block(

        function() {
            // Get the page meta data.
            return $meta.page(self.name);
        },

        function(/** @type {Page} */page) {

            // Page meta data not found.
            if (page === null)
                $app.error('Cannot find page meta data: {0}', self.name);

            self.page = page;

            // Load the window and set the title.
            self.window.load(container).setTitle(self.page.caption);

            // Add actions.
            $.each(self.page.actions, function(i, action) {
                self.window.addAction(action);
            });

            // Get the page contoller (from file).
            if (self.page.controller !== '')
                return $controller.load(self.page.controller);
        },

        function() {

            // Execute the controller.
            if (self.page.controller !== '')
                $controller.get(self.page.controller)(self);

            // Show the window.
            self.window.show();
        }

    );
};

/**
 * Get a window button by name.
 * @param {string} name Name of the button to get.
 * @returns {JQuery} Button as a `JQuery` object. If the button is not found, `null`
 * is returned.
 */
PageComponent.prototype.action = function(name) {
    return this.window.action(name);
};

module.exports = PageComponent;
