'use strict';

var $code = require('../code'),
  $settings = require('../settings');

/**
 * Base application component.
 * @class
 */
function AppComponent() {

  var HeaderComponent = require('./header');

  this.header = new HeaderComponent();
  /**
   * Main container for sub components.
   * @type {JQuery}
   */
  this.main = null;
  this.pages = [];
}

/**
 * Load the component into the container.
 * @private
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {void}
 */
AppComponent.prototype.load = function(container) {

  var $ = require('../../external/jquery');

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

AppComponent.prototype.loadPage = function(name) {

  var self = this,
    PageComponent = require('./page'),
    pge = new PageComponent(name);

  return $code.block(
    function() {
      // Load the page component.
      return pge.load(self.main);
    },
    function() {
      // Add the page to the loaded pages.
      self.pages.push(pge);
    }
  );
};

module.exports = AppComponent;
