/**
 * @typedef {(number|string)} Key
 */

/**
 * Alias for `Function`. Use this where you have repeatable function params.
 * @typedef {Function} GenericFunction
 * @param {...*} [args] Function arguments.
 */

/**
 * Error handler function.
 * @typedef {Function} ErrorHandler
 * @param {(string|Error)} msg Error message.
 * @param {...*} [args] Function arguments.
 */

/**
 * Action runner function.
 * @typedef {Function} ActionRunner
 * @param {PageActionMeta} action Action meta data.
 * @param {Function} func Function to run.
 * @returns {void}
 */

/**
 * @typedef {Function} ErrorInstance
 * @param {string} code Error code.
 * @param {string} message Error message.
 * @param {...*} args Message arguments.
 * @returns {Error} Returns new error object.
 */

/**
 * Server Instance
 * @typedef {object} ServerInstance
 * @property {function():(JQueryPromise|void)} autoLogin Attempt to auto login.
 */

/**
 * @callback AlertInstanceMessage
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @returns {void}
 */

/**
 * @callback AlertInstanceConfirmCallback
 * @param {boolean} ret `true` if the user clicked the `OK` button.
 * @returns {void}
 */

/**
 * @callback AlertInstanceConfirm
 * @param {string} msg Message to display.
 * @param {AlertInstanceConfirmCallback} callbackFn Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @param {string} [yescaption] Caption of the "yes" button.
 * @param {string} [nocaption] Caption of the "no" button.
 * @returns {void}
 */

/**
 * @callback AlertInstanceError
 * @param {string} msg Message to display.
 * @returns {void}
 */

/**
 * @callback ActionRunnerOnClick
 * @returns {(void|JQueryPromise<any>)}
 */

/**
 * Alert instance.
 * @typedef {object} AlertInstance
 * @property {AlertInstanceMessage} message Show a message box.
 * @property {AlertInstanceConfirm} confirm Show a confirmation box.
 * @property {AlertInstanceError} error Show an error message box.
 */

/**
 * @callback IconsInstanceGet
 * @param {string} [name] Name of the icon.
 * @param {string} [className] Classes to add to the icon.
 * @returns {string} Icon html string.
 */

/**
 * Icons instance.
 * @typedef {object} IconsInstance
 * @property {IconsInstanceGet} get Get an icon by name.
 */

/**
 * App configuration.
 * @typedef {object} AppConfig
 * @property {string} [name] App name (displays in header if there is no logo image). Defaults to `Backbrace App`.
 * @property {string} [version] App version. Defaults to `0.1.0`.
 * @property {string} [title] App tite (displays in browser window). Defaults to `New Backbrace App`.
 * @property {string} [description] App description. Defaults to `Web App powered by Backbrace`.
 */

/**
 * Meta data configuration.
 * @typedef {object} MetaConfig
 * @property {string} [dir] Meta data root directory. Defaults to `./meta`.
 */

/**
 * Images style.
 * @typedef {object} ImagesStyle
 * @property {string} [logo] URL for the logo image (displayed in the header).
 * @property {string} [menuLogo] URL for the menu logo image (displayed at the top of the main menu).
 * @property {string} [blocker] URL for the blocker image (displayed while the loader is shown).
 */

/**
 * Colours style.
 * @typedef {object} ColorsStyle
 * @property {string} [bgprimary] Primary color. Displayed most frequently accross the app.
 * @property {string} [textprimary] Primary text color.
 * @property {string} [bgprimaryvar] Primary variant color.
 * @property {string} [textprimaryvar] Primary variant text color.
 * @property {string} [bgsecondary] Secondary color.
 * @property {string} [textsecondary] Secondary text color.
 * @property {string} [bgsecondaryvar] Secondary variant color.
 * @property {string} [textsecondaryvar] Secondary variant text color.
 * @property {string} [bgsurface] Surface color of components.
 * @property {string} [textsurface] Surface text color.
 * @property {string} [bgbody] Appears behind content.
 * @property {string} [textbody] Background text color.
 * @property {string} [bghover] Hover background color.
 * @property {string} [texthover] Hover text color.
 */

/**
 * App style configuration.
 * @typedef {object} StyleConfig
 * @property {string} [loader] Style loader. Defaults to `materialdesign`.
 * @property {ImagesStyle} [images] Images style.
 * @property {ColorsStyle} [colors] Colors style.
 */

/**
 * Application settings.
 * @typedef {object} Settings
 * @property {boolean} [debug] Set the app to debug mode. Defaults to `false`.
 * @property {boolean} [minify] Load minified packages. Defaults to `true`.
 * @property {boolean} [guiAllowed] GUI allowed flag.
 * @property {boolean} [windowMode] Allow the use of multiple windows. Defaults to `true`.
 * @property {string} [packages] Packages URL.
 * @property {AppConfig} [app] App config.
 * @property {MetaConfig} [meta] Meta data config.
 * @property {StyleConfig} [style] Style config.
 */

/**
 * Global variables.
 * @typedef {object} Globals
 * @property {string} [CDNSERVER] CDN server URL.
 * @property {boolean} [DEVMODE] If `true` then we are running in a development environment.
 */

/**
* Callback function for creating a controller.
* @callback ControllerCallback
* @param {ViewerComponent} viewer Viewer component.
* @returns {void}
*/

/**
* @callback DataCallback
* @param {any[]} data Data array.
* @returns {void}
*/

/**
 * @typedef {object} HeaderOptions
 * @property {string} [menuIcon] Menu icon.
 * @property {boolean} [attachMenu] Attach a menu to the header.
 * @property {string} [className] Header class.
 */

/**
 * @typedef {object} ViewerOptions
 * @property {string} [title] Page title.
 * @property {boolean} [hasParent] If `true` sets the page as a child page.
 * @property {boolean} [temp] If `true` the page uses temp data.
 * @property {string} [updateHistory] Add a url path to the browser history.
 */

/**
 * @typedef {object} WindowOptions
 * @property {string} [icon] Window icon.
 * @property {Function} [onClose] On close function of the window.
 * @property {boolean} [hasParent] If `true` sets the window as a child window.
 * @property {boolean} [closeBtn] Add a close button to the window.
 * @property {string} [className] Window class style.
 */

/**
 * @typedef {object} Route
 * @property {string} path Path to match.
 * @property {string} page Page to load.
 */

/**
 * @typedef {object} PageFieldMeta
 * @property {string} name Name of the field.
 * @property {string} caption Caption of the field.
 * @property {string} type  Data type for the field.
 * @property {string} component Custom component to use for the field.
 * @property {string} width Width of the field. Defaults to `100px`.
 * @property {boolean} hidden Don't display the field on the page.
 * @property {boolean} editable Readonly field.
 * @property {string} className Classes to add to the field.
 */
export let pagefield = {
  name: '',
  caption: '',
  type: 'Text',
  component: '',
  width: '100px',
  editable: true,
  hidden: false,
  className: 's12 m6'
};

/**
 * @typedef {object} PageActionMeta
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
 * @typedef {object} PageSectionMeta
 * @property {string} name Name of the section.
 * @property {string} text Caption of the section.
 * @property {string} pageName Display a subpage in this section.
 * @property {string} icon Section icon.
 * @property {string} className Classes to add to the section.
 * @property {PageFieldMeta[]} fields Page section fields.
 */
export let pagesection = {
  name: '',
  text: '',
  pageName: '',
  icon: '',
  className: '',
  fields: []
};

/**
 * @typedef {object} PageMeta
 * @property {string} name Name of the page.
 * @property {string} caption Caption of the page.
 * @property {string} component Component for the whole page (defaults to `cardpage`).
 * @property {string} controller Page controller.
 * @property {string} tableName Name of the page's datasource.
 * @property {string} icon Icon to use for the page.
 * @property {string} filters Filters for the page.
 * @property {PageActionMeta[]} actions Page actions.
 * @property {PageSectionMeta[]} sections Page sections.
 */
export let pagemeta = {
  name: '',
  caption: '',
  component: 'cardpage',
  controller: '',
  tableName: '',
  icon: '',
  filters: '',
  actions: [],
  sections: []
};

/**
 * @typedef {object} TableColumnMeta
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
 * @typedef {object} TableMeta
 * @property {string} name Name of the table.
 * @property {string} controller Table controller.
 * @property {string} data Table data (if from a file).
 * @property {TableColumnMeta[]} columns Table columns.
 */
export let tablemeta = {
  name: '',
  controller: '',
  data: '',
  columns: []
};
