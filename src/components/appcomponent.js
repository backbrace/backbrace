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
   * Header component (desktop only).
   * @type {HeaderComponent}
   */
  this.header = new HeaderComponent({});

  /**
   * Main container for sub components.
   * @type {JQuery}
   */
  this.main = null;

  /**
   * Windows toolbar (if using window mode).
   * @type {JQuery}
   */
  this.windows = null;

  /**
   * Loaded pages (`PageComponent` ID as key).
   * @type {Object}
   */
  this.pages = {};

  /**
   * Current active page.
   * @type {number}
   */
  this.activePage = 0;
}

/**
 * Load the component into the container.
 * @private
 * @param {JQuery} container JQuery element to load the component into.
 * @returns {void}
 */
AppComponent.prototype.load = function(container) {

  var self = this;

  this.main = $('<div class="main"></div>').appendTo(container);

  // Add window toolbar.
  if ($settings.windowMode && !$settings.mobile)
    this.windows = $('<div class="main-windows"></div>').appendTo(this.main);

  $('body').addClass($settings.mobile ? 'mobile-app' : 'desktop-app');

  // Load components.
  this.header.setTitle($settings.style.images.logo !== '' ?
    '<img class="navbar-logo" src="' + $settings.style.images.logo + '" />' :
    $settings.app.name);
  if (!$settings.mobile) {
    this.header.load(this.main);
    this.header.navbar.addClass('fixed');
    this.header.menuIcon.click(function() {
      self.header.showMenu();
    });
  }
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
 * @param {Object} [settings] Page settings.
 * @returns {JQueryPromise} Promise to load the page.
 */
AppComponent.prototype.loadPage = function(name, settings) {

  var self = this,
    pge = new PageComponent(name, settings || {});

  pge.settings.first = Object.keys(this.pages).length === 0;
  if (pge.settings.first && $settings.mobile)
    pge.header = this.header;

  return $code.block(
    function() {
      // Load the page component.
      return pge.load(self.main);
    },
    function() {

      // Hide the currently active page.
      if (self.activePage > 0 && self.pages[self.activePage])
        self.pages[self.activePage].hide();

      // Add the page to the loaded pages.
      self.pages[pge.id] = pge;
      self.activePage = pge.id;
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
      delete self.pages[id];
      if (self.activePage === id)
        self.activePage = 0;

      // Open next page.
      var keys = Object.keys(self.pages);
      if (keys.length > 0) {
        /** @type {PageComponent} */
        var nextpge = self.pages[keys[keys.length - 1]];
        nextpge.show();
        self.activePage = nextpge.id;
      }

    }
  );
};

/**
 * Show a loaded page.
 * @param {number} id ID of the page to show.
 * @returns {void}
 */
AppComponent.prototype.showPage = function(id) {

  var $app = require('../app');

  if (id === this.activePage)
    return;

  // Hide the currently active page.
  if (this.activePage > 0 && this.pages[this.activePage])
    this.pages[this.activePage].hide();

  // Show the page.
  /** @type {PageComponent} */
  var pge = this.pages[id];
  if (!$util.isDefined(pge))
    $app.error('Cannot find page by id: {0}', id);

  pge.show();
  this.activePage = pge.id;
};

module.exports = AppComponent;
