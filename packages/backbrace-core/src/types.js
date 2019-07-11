/**
 * @typedef {(number|string)} key
 */

/**
 * Alias for `Function`. Use this where you have repeatable function params.
 * @typedef {Function} genericFunction
 * @param {...*} [args] Function arguments.
 */

/**
 * Error handler function.
 * @typedef {Function} errorHandler
 * @param {(string|Error)} msg Error message.
 * @param {...*} [args] Function arguments.
 */

/**
 * Action runner function.
 * @typedef {Function} actionRunner
 * @param {pageActionDesign} action Action design.
 * @returns {void}
 */

/**
 * @typedef {Function} errorInstance
 * @param {string} code Error code.
 * @param {string} message Error message.
 * @param {...*} args Message arguments.
 * @returns {Error} Returns new error object.
 */

/**
 * @callback alertInstanceMessage
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @returns {void}
 */

/**
 * @callback alertInstanceConfirmCallback
 * @param {boolean} ret `true` if the user clicked the `OK` button.
 * @returns {void}
 */

/**
 * @callback alertInstanceConfirm
 * @param {string} msg Message to display.
 * @param {alertInstanceConfirmCallback} callbackFn Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @param {string} [yescaption] Caption of the "yes" button.
 * @param {string} [nocaption] Caption of the "no" button.
 * @returns {void}
 */

/**
 * @callback alertInstanceError
 * @param {string} msg Message to display.
 * @returns {void}
 */

/**
 * @callback actionRunnerOnClick
 * @returns {(void|JQueryPromise<any>)}
 */

/**
 * Alert instance.
 * @typedef alertInstance
 * @property {alertInstanceMessage} message Show a message box.
 * @property {alertInstanceConfirm} confirm Show a confirmation box.
 * @property {alertInstanceError} error Show an error message box.
 */

/**
 * @callback iconsInstanceGet
 * @param {string} name Name of the icon.
 * @param {string} [className] Classes to add to the icon.
 * @returns {string} Icon html string.
 */

/**
 * Icons instance.
 * @typedef iconsInstance
 * @property {iconsInstanceGet} [get] Get an icon by name.
 */

/**
 * App configuration.
 * @typedef appConfig
 * @property {string} [name] App name (displays in header if there is no logo image). Defaults to `Backbrace App`.
 * @property {string} [version] App version. Defaults to `0.1.0`.
 * @property {string} [title] App tite (displays in browser window). Defaults to `New Backbrace App`.
 * @property {string} [description] App description. Defaults to `Web App powered by Backbrace`.
 */

/**
 * Directory configuration.
 * @typedef dirConfig
 * @property {string} [design] Designs root directory. Defaults to `/design/`.
 * @property {string} [tern] Tern data root directory. Defaults to `/json/`.
 */

/**
 * Images style.
 * @typedef imagesConfig
 * @property {string} [logo] URL for the logo image (displayed in the header).
 * @property {string} [menuLogo] URL for the menu logo image (displayed at the top of the main menu).
 * @property {string} [blocker] URL for the blocker image (displayed while the loader is shown).
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
 * @property {string} [css] CSS URL to load.
 * @property {imagesConfig} [images] Images style.
 * @property {colorsConfig} [colors] Colors style.
 */

/**
 * Application settings.
 * @typedef settingsConfig
 * @property {boolean} [debug] Set the app to debug mode. Defaults to `false`.
 * @property {boolean} [minify] Load minified packages. Defaults to `true`.
 * @property {boolean} [guiAllowed] GUI allowed flag.
 * @property {boolean} [windowMode] Allow the use of multiple windows. Defaults to `true`.
 * @property {appConfig} [app] App config.
 * @property {dirConfig} [dir] Directory config.
 * @property {styleConfig} [style] Style config.
 */

/**
 * Global variables.
 * @typedef globalVariables
 * @property {string} CDNSERVER CDN server URL.
 * @property {boolean} DEVMODE If `true` then we are running in a development environment.
 * @property {string} FULLVERSION Returns the full version number.
 */

/**
* Callback function for creating a controller.
* @callback controllerCallback
* @param {ViewerComponent} viewer Viewer component.
* @param {SectionComponent} [section] Section component (section controllers only).
* @returns {void}
*/

/**
* @callback dataCallback
* @param {any[]} data Data array.
* @returns {JQueryPromise<any[]>|any[]} Promises to return the data.
*/

/**
 * @typedef headerOptions
 * @property {string} [menuIcon] Menu icon.
 * @property {boolean} [attachMenu] Attach a menu to the header.
 * @property {string} [className] Header class.
 */

/**
 * @typedef viewerOptions
 * @property {string} [title] Page title.
 * @property {boolean} [hasParent] If `true` sets the page as a child page.
 * @property {boolean} [temp] If `true` the page uses temp data.
 * @property {string} [updateHistory] Add a url path to the browser history.
 */

/**
 * @typedef viewerEvents
 * @property {dataCallback} beforeUpdate Runs before the data is bound to the component.
 * @property {Map<string, genericFunction>} actionClick Runs on click of an action.
 */

/**
 * @typedef windowOptions
 * @property {string} [icon] Window icon.
 * @property {Function} [onClose] On close function of the window.
 * @property {boolean} [hasParent] If `true` sets the window as a child window.
 * @property {boolean} [closeBtn] Add a close button to the window.
 * @property {string} [className] Window class style.
 */

/**
 * @typedef routeConfig
 * @property {string} path Path to match.
 * @property {string} page Page to load.
 */

/**
 * @typedef pageFieldDesign
 * @property {string} name Name of the field.
 * @property {string} caption Caption of the field.
 * @property {string} type  Data type for the field.
 * @property {string} dataName  Name of the field in the data source.
 * @property {string} component Custom component to use for the field.
 * @property {string} width Width of the field. Defaults to `100px`.
 * @property {boolean} hidden Don't display the field on the page.
 * @property {boolean} editable Readonly field.
 * @property {string} className Classes to add to the field.
 */
export let pagefield = {
  name: '',
  caption: '',
  dataName: '',
  type: 'Text',
  component: '',
  width: '100px',
  editable: true,
  hidden: false,
  className: 'col-sm-12 col-md-6'
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
 * @property {string} text Caption of the section.
 * @property {string} pageName Display a subpage in this section.
 * @property {string} icon Section icon.
 * @property {string} className Classes to add to the section.
 * @property {string} component Component for the section (defaults to `cardpage`).
 * @property {string} controller Section controller.
 * @property {string} data Data source for the section (if empty, uses the pages data source).
 * @property {pageFieldDesign[]} fields Page section fields.
 * @property {pageActionDesign[]} actions Page actions.
 */
export let pagesection = {
  name: '',
  text: '',
  pageName: '',
  icon: '',
  className: '',
  component: 'cardpage',
  controller: '',
  data: '',
  fields: [],
  actions: []
};

/**
 * @typedef pageDesign
 * @property {string} name Name of the page.
 * @property {string} caption Caption of the page.
 * @property {string} controller Page controller.
 * @property {string} data Data source for the page.
 * @property {string} icon Icon to use for the page.
 * @property {string} filters Filters for the page.
 * @property {pageSectionDesign[]} sections Page sections.
 */
export let pagedesign = {
  name: '',
  caption: '',
  controller: '',
  data: '',
  icon: '',
  filters: '',
  sections: []
};

/**
 * @typedef tableColumnDesign
 * @property {string} name Name of the column.
 * @property {string} caption Caption of the column.
 * @property {string} type  Data type for the column.
 */
export let tablecolumn = {
  name: '',
  caption: '',
  type: 'Text'
};

/**
 * @typedef tableDesign
 * @property {string} name Name of the table.
 * @property {string} controller Table controller.
 * @property {string} data Table data (if from a file).
 * @property {tableColumnDesign[]} columns Table columns.
 */
export let tabledesign = {
  name: '',
  controller: '',
  data: '',
  columns: []
};
