'use strict';

var $code = require('../code'),
  $settings = require('../settings'),
  $util = require('../util'),
  $ = require('../../external/jquery')(),
  HeaderComponent = require('./headercomponent'),
  PageComponent = require('./pagecomponent');

/**
 * Base application component.
 * @class
 */
function AppComponent() {

  $ = $ || require('../../external/jquery')();

  /**
   * Header component.
   * @type {HeaderComponent}
   */
  this.header = new HeaderComponent();

  /**
   * Main container for sub components.
   * @type {JQuery}
   */
  this.main = null;

  /**
   * Loaded pages (`PageComponent` ID as key).
   * @type {Object}
   */
  this.pages = {};
}

/**
 * Load the component into the container.
 * @private
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {void}
 */
AppComponent.prototype.load = function(container) {

  this.main = $('<div class="main"></div>').appendTo(container);

  $('body').addClass($settings.mobile ? 'mobile-app' : 'desktop-app');

  // Load components.
  this.header.load(this.main);
};

/**
 * Load the main menu.
 * @returns {AppComponent} Returns itself for chaining.
 */
AppComponent.prototype.loadMenu = function() {
  this.header.loadMenu();
  return this;
};

/**
 * Load a page.
 * @param {string} name Name of the page to load.
 * @returns {JQueryPromise} Promise to load the page.
 */
AppComponent.prototype.loadPage = function(name) {

  var self = this,
    pge = new PageComponent(name, {});

  return $code.block(
    function() {
      // Load the page component.
      return pge.load(self.main);
    },
    function() {
      // Add the page to the loaded pages.
      self.pages[pge.id] = pge;
    }
  );
};

/**
 * Close an opened page.
 * @param {number} id ID of the page to close.
 * @returns {JQueryPromise} Promise to close the page.
 */
AppComponent.prototype.closePage = function(id) {
  var self = this,
    $app = require('../app');
  return $code.block(
    function() {
      // Unload the page.
      /** @type {PageComponent} */
      var pge = self.pages[id];
      if (!$util.isDefined(pge))
        $app.error('Cannot find page by id: {0}', id);
      pge.unload();
      // Remove the page from the loaded pages.
      self.pages[id] = null;
    }
  );
};

module.exports = AppComponent;
