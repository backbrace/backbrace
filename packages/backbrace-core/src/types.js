/* eslint-disable no-unused-vars */
import { AppError } from './errors/app';

/**
 * @callback errorInstance
 * @param {string} code Error code.
 * @param {string} message Error message.
 * @returns {AppError} Returns a new error object.
 */

/**
 * @typedef {Event} clipboardEvent
 * @property {string} action Action name.
 * @property {string} text Clipboard text.
 * @property {Element} trigger Element that triggered the event.
 * @property {Function} clearSelection Clear the clipboard.
 */

/**
 * @callback clipboardSuccess
 * @param {clipboardEvent} evt Clipboard event.
 * @returns {void}
 */

/**
* @callback readyFunction
* @param {import('./components/app').App} app App component.
* @returns {void}
*/

/**
 * Auth info object.
 * @typedef authInfo
 * @property {string} [token] Auth token. Used in all requests as a bearer token.
 * @property {string} [userID] ID of the authenticated user.
 */

/**
 * User info object.
 * @typedef userInfo
 * @property {string} [email] Email address.
 * @property {string} [name] Full name of the user.
 * @property {string} [initials] User initials.
 * @property {string} [image] User profile image.
 */

/**
 * App configuration.
 * @typedef appConfig
 * @property {string} [name] App name (displays in header if there is no logo image). Defaults to `Backbrace App`.
 * @property {string} [version] App version. Defaults to `0.1.0`.
 * @property {string} [title] App tite (displays in browser window). Defaults to `New Backbrace App`.
 * @property {string} [description] App description. Defaults to `Web App powered by Backbrace`.
 * @property {pageSectionDesign} [footer] Footer section design.
 */

/**
 * Directory configuration.
 * @typedef dirConfig
 * @property {string} [design] Designs root directory. Defaults to `/design/`.
 * @property {string} [typings] Typings data root directory. Defaults to `/typings/`.
 */

/**
 * Images style.
 * @typedef imagesConfig
 * @property {string} [logo] URL for the logo image (displayed in the header).
 * @property {string} [menuLogo] URL for the menu logo image (displayed at the top of the main menu).
 */

/**
 * Colours style.
 * @typedef colorsConfig
 * @property {string} [bgprimary] Primary color. Displayed most frequently accross the app.
 * @property {string} [textprimary] Primary text color.
 * @property {string} [bgsecondary] Secondary color.
 * @property {string} [textsecondary] Secondary text color.
 * @property {string} [bgsurface] Surface color of components.
 * @property {string} [textsurface] Surface text color.
 * @property {string} [bgbody] Appears behind content.
 * @property {string} [textbody] Background text color.
 * @property {string} [bghover] Hover background color.
 * @property {string} [texthover] Hover text color.
 */

/**
 * App style configuration.
 * @typedef styleConfig
 * @property {string} [loader] Style loader. Defaults to `materialdesign`.
 * @property {imagesConfig} [images] Images style.
 * @property {colorsConfig} [colors] Colors style.
 */

/**
 * App head configuration.
 * @typedef headConfig
 * @property {Object[]} [meta] Each item in the array maps to a newly-created `meta` element, where object properties map to attributes.
 * @property {Object[]} [link] Each item in the array maps to a newly-created `link` element, where object properties map to attributes.
 * @property {Object[]} [script] Each item in the array maps to a newly-created `script` element, where object properties map to attributes.
 */

/**
 * App auth configuration.
 * @typedef authConfig
 * @property {string} [login] Set the path to the login page.
 * @property {string} [logout] Set the path to the logout page.
 * @property {string} [refreshTokenURL] URL to refresh the auth token.
 */

/**
 * Application settings.
 * @typedef settingsConfig
 * @property {boolean} [debug] Set the app to debug mode. Defaults to `false`.
 * @property {string} [serviceWorker] Service worker file name.
 * @property {boolean} [windowMode] Allow the use of multiple windows. Defaults to `false`.
 * @property {string} [base] Base path.
 * @property {appConfig} [app] App config.
 * @property {dirConfig} [dir] Directory config.
 * @property {styleConfig} [style] Style config.
 * @property {routeConfig[]} [routes] App routes.
 * @property {headConfig} [head] Head config.
 * @property {authConfig} [auth] App auth config.
 */

/**
 * Global variables.
 * @typedef globalVariables
 * @property {boolean} DEVMODE If `true` then we are running in a development environment.
 * @property {string} FULLVERSION Returns the full version number.
 */

/**
 * @typedef routeConfig
 * @property {string} path Path to match.
 * @property {string} page Page to load.
 * @property {Object} [params] Page parameters.
 * @property {boolean} [private] Set to `true` if the route requires the user to be authenticated.
 */

/**
 * @typedef componentState
 * @property {Object[]} [data] State data.
 * @property {boolean} [hasError] `True` if the component has an error.
 * @property {boolean} [hasFocus] `True` if the component has focus.
 * @property {Error} [error] Error object.
 * @property {boolean} [isLoading] `True` if the component is currently loading data.
 * @property {boolean} [isLoaded] `True` if the component has loaded it's data.
 */

/**
 * @typedef pageFieldDesign
 * @property {string} name Name of the field.
 * @property {string} caption Caption of the field.
 * @property {string} type  Data type for the field.
 * @property {string} bind Data property to bind to.
 * @property {string} component Custom component to use for the field.
 * @property {boolean} hidden Don't display the field on the page.
 * @property {boolean} editable Readonly field.
 * @property {Object} attributes Field component attributes.
 */
export let pagefield = {
  name: '',
  caption: '',
  type: 'Text',
  bind: '',
  component: '',
  editable: true,
  hidden: false,
  attributes: {}
};

/**
 * @typedef pageActionDesign
 * @property {string} name Name of the action.
 * @property {string} text Caption of the action.
 * @property {string} icon Icon to use on the button.
 * @property {string} iconColor Icon color. Defaults to header color.
 * @property {string} className Classes to add to the button.
 */
export let pageaction = {
  name: '',
  text: '',
  icon: '',
  iconColor: '',
  className: ''
};

/**
 * @typedef pageSectionDesign
 * @property {string} name Name of the section.
 * @property {string} [caption] Caption of the section.
 * @property {string} [icon] Section icon.
 * @property {string} [className] Classes to add to the section.
 * @property {string} [component] Component for the section (defaults to `cardpage`).
 * @property {Object} [attributes] Section component attributes.
 * @property {string} [data] Data source (ie. JSON file).
 * @property {string} [query] Data query.
 * @property {string} [bind] Data property to bind to.
 * @property {pageFieldDesign[]} [fields] Page section fields.
 * @property {pageActionDesign[]} [actions] Page actions.
 */
export let pagesection = {
  name: '',
  caption: '',
  icon: '',
  className: '',
  component: 'card',
  attributes: {},
  data: '',
  query: '',
  bind: '',
  fields: [],
  actions: []
};

/**
 * @typedef pageDesign
 * @property {string} caption Caption of the page.
 * @property {string} data Data source (ie. JSON file).
 * @property {string} icon Icon to use for the page.
 * @property {boolean} noclose Don't allow the page to be closed (in windowed mode).
 * @property {pageSectionDesign[]} sections Page sections.
 */
export let pagedesign = {
  caption: '',
  data: '',
  icon: '',
  noclose: false,
  sections: []
};
