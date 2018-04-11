'use strict';

var app = require('../app'),
    code = require('../code'),
    controller = require('../controller'),
    icons = require('../providers/icons').get(),
    meta = require('../meta'),
    settings = require('../settings'),
    util = require('../util'),
    $ = require('../../external/jquery')(),
    HeaderComponent = require('./headercomponent'),
    WindowComponent = require('./windowcomponent');

/**
 * Page component. Used to display a page.
 * @class
 * @private
 * @param {string} name Page name.
 * @param {Object} settings Page Settings.
 */
function PageComponent(name, settings) {

    /**
     * Header component (mobile only).
     * @type {HeaderComponent}
     */
    this.header = null;

    /**
     * Unique ID of the page component.
     * @type {number}
     */
    this.id = util.nextID();

    /**
     * Name of the page.
     * @type {string}
     */
    this.name = name;

    /**
     * Page title.
     * @type {string}
     */
    this.title = '';

    /**
     * Page component settings.
     */
    this.settings = {
        title: null,
        factbox: false,
        hasParent: false,
        first: false
    };

    // Merge settings.
    $.extend(this.settings, settings);

    /**
     * Page meta data.
     * @type {PageMeta}
     */
    this.page = null;

    /**
     * The page's window component.
     * @type {WindowComponent}
     */
    this.window = new WindowComponent({});

    /**
     * The component that renders over the entire window.
     * @type {Component}
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
    if (this.header)
        this.header.unload();
    this.header = null;
    // Unload DOM.
    this.mainContainer.remove();
    this.sideContainer.remove();
    $('#win' + this.id).remove();
};

/**
 * Load the component into the container.
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {JQueryPromise} Promise to load the page.
 */
PageComponent.prototype.load = function(container) {

    var self = this;

    this.mainContainer = $('<div class="main-container"></div>')
        .appendTo(container);
    this.sideContainer = $('<div class="side-container"></div>')
        .appendTo(!settings.mobile ? container : null);

    // Load header.
    if (settings.mobile) {

        // Move the container over so we can animate it in.
        this.mainContainer.css('left', '100vw');

        if (!this.header) {
            this.header = new HeaderComponent({
                menuIcon: 'keyboard-backspace',
                attachMenu: false
            });
            this.header.load(this.mainContainer);
            this.header.menuIcon.click(function() {
                app.closePage(self.id);
            });
        } else {
            this.header.load(this.mainContainer);
            this.header.menuIcon.click(function() {
                self.header.showMenu();
            });
        }
    }

    return code.block(

        function getMetadata() {
            // Get the page meta data.
            return meta.page(self.name);
        },

        /**
         * @param {PageMeta} page Page meta data.
         * @returns {(void|JQueryPromise)} Promise to return after we load the component.
         */
        function loadComponent(page) {

            // Page meta data not found.
            if (page === null)
                app.error('Cannot find page meta data: {0}', self.name);

            self.page = page;

            // Load into main or side container?
            var cont = self.mainContainer;
            if ((self.settings.factbox === true || page.factbox)
                && !settings.mobile)
                cont = self.sideContainer;

            // Load the window.
            self.window.load(cont);

            // Add the page to the windows toolbar.
            if (!settings.mobile && settings.windowMode && !self.settings.hasParent) {
                app.addWindowToToolbar(self.id);
            }

            self.setTitle(self.settings.title || page.caption);

            // Add close function.
            self.window.settings.onClose = function() {
                app.closePage(self.id);
            };

            // Add actions.
            $.each(page.actions, function(i, action) {
                self.window.addAction(action);
            });

            // Load the page component.
            if (page.type === 'Card') {
                var CardComponent = require('./cardcomponent');
                self.pageComponent = new CardComponent(self);
                return self.pageComponent.load();
            }
        },

        function getController() {

            // Get the page contoller (from file).
            if (self.page.controller !== '')
                return controller.load(self.page.controller);
        },

        function executeController() {

            // Execute the controller.
            if (self.page.controller !== '')
                controller.get(self.page.controller)(self);

            // Show the page.
            self.show();
        }

    );
};

/**
 * Show the page.
 * @returns {PageComponent} Returns itself for chaining.
 */
PageComponent.prototype.show = function() {

    this.window.show();
    $('#win' + this.id).addClass('active');

    // Show the page component.
    this.pageComponent.show();

    this.animateIn();

    return this;
};

/**
 * Hide the page.
 * @returns {PageComponent} Returns itself for chaining.
 */
PageComponent.prototype.hide = function() {

    if (settings.mobile) {
        this.animateOut();
        return this;
    }

    this.window.hide();
    $('#win' + this.id).removeClass('active');

    // Hide the page component.
    this.pageComponent.hide();

    return this;
};

/**
 * Set the title of the page.
 * @param {string} title Title to change to.
 * @returns {PageComponent} Returns itself for chaining.
 */
PageComponent.prototype.setTitle = function(title) {
    this.title = title;
    this.window.setTitle(title);
    $('#win' + this.id + '>span').html(util.formatString('{0} {1}',
        icons.get(this.page.icon),
        title
    ));
    if (this.header && !this.settings.first)
        this.header.setTitle(title);
    return this;
};

/**
 * Show the side container.
 * @returns {PageComponent} Returns itself for chaining.
 */
PageComponent.prototype.showSide = function() {
    this.sideContainer.css('display', 'inline-block');
    this.mainContainer.css('width', '70%');
    return this;
};

PageComponent.prototype.animateIn = function() {
    var self = this;
    if (!settings.mobile)
        return this;
    self.mainContainer.animate({
        left: '0px'
    }, null, null, function() {
        self.header.navbar.addClass('fixed');
        self.mainContainer.addClass('pad');
    });
    return this;
};

PageComponent.prototype.animateOut = function() {
    var self = this;
    if (!settings.mobile)
        return;
    self.header.navbar.removeClass('fixed');
    self.mainContainer.removeClass('pad');
    self.mainContainer.animate({
        left: '-100vw'
    });
    return this;
};

module.exports = PageComponent;
