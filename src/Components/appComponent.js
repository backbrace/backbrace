'use strict';

/**
 * Base application component.
 * @module components
 * @class
 */
function AppComponent() {
  this.header = new HeaderComponent();
  /** @type {JQuery} */
  this.main = null;
}

AppComponent.package = function() {
  var min = ($app.settings.minify ? '.min' : '');
  return [
    [
      'https://cdn.materialdesignicons.com/2.0.46/css/materialdesignicons' + min + '.css',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment' + min + '.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' +
      ($app.settings.minify ? '.min' : '-dev') + '.js',
      'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert' + min + '.css',
      'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.js',
      'https://cdn.jumpstartjs.org/jquery-ripple/0.2.1/jquery.ripple.css'
    ],
    [
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/en-au.js'
    ]
  ];
};

AppComponent.template = '<div class="main">';

AppComponent.prototype.load = function(container) {

  this.main = $js.mergeTemplate(AppComponent.template, this).appendTo(container);

  $('body').addClass($js.mobile ? 'mobile-app' : 'desktop-app');

  // Load the components.
  this.header.load(this.main);

  // Init helpers.
  alertHelper.init();

  // Setup handlers.
  $js.handlers = {
    message: alertHelper.alert,
    confirm: alertHelper.alert,
    error: function(msg) {
      alertHelper.alert(msg, null, 'Application Error');
    }
  };

  // Load main menu.
  this.header.loadMenu();

  // Load profile image.
  this.header.loadProfileImage('https://cdn.jumpstartjs.org/images/profile.jpg');

  // Load the home page.
  if ($app.settings.homePage)
    this.loadPage($app.settings.homePage);
};

AppComponent.prototype.loadPage = function(name) {
  var pge = new PageComponent(name);
  return pge.load(this.main);
};

$window['AppComponent'] = AppComponent;
