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
 * Loader style.
 * @typedef {object} LoaderStyle
 * @property {string} [zindex] Loader bar z-index. Defaults to `1000`.
 * @property {string} [barheight] Loader bar height. Defaults to `10px`.
 * @property {string} [barwidth] Loader bar width. Defaults to `800px`.
 * @property {string} [progressbackground] Progress bar background. Defaults to `#A2CFEE`.
 * @property {string} [progresscolor] Progress bar foreground color. Defaults to `#3498DB`.
 * @property {string} [blockerbackground] Background for loader blocker. Defaults to `#ECF0F1`.
 */

/**
 * Font style.
 * @typedef {object} FontStyle
 * @property {string} [url] URL for the font. Defaults to Roboto font.
 * @property {string} [family] Font family to use for the app. Defaults to `'Roboto', sans-serif`.
 * @property {string} [size] Font size. Defaults to `16px`.
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
 * @property {string} [primary] Primary color. Displayed most frequently accross the app.
 * @property {string} [primarytext] Primary text color.
 * @property {string} [primaryvar] Primary variant color.
 * @property {string} [primaryvartext] Primary variant text color.
 * @property {string} [secondary] Secondary color.
 * @property {string} [secondarytext] Secondary text color.
 * @property {string} [secondaryvar] Secondary variant color.
 * @property {string} [secondaryvartext] Secondary variant text color.
 * @property {string} [surface] Surface color of components.
 * @property {string} [surfacetext] Surface text color.
 * @property {string} [background] Appears behind content.
 * @property {string} [backgroundtext] Background text color.
 * @property {string} [hover] Hover background color.
 * @property {string} [hovertext] Hover text color.
 */

/**
 * Screen sizes.
 * @typedef {object} ScreenSizes
 * @property {number} [small] Mobile screen. Defaults to `600`.
 * @property {number} [smallUp] Mobile screen upper. Defaults to `601`.
 * @property {number} [medium] Tablet screen. Defaults to `992`.
 * @property {number} [mediumUp] Tablet screen upper. Defaults to `993`.
 * @property {number} [large] Desktop screen. Defaults to `1200`.
 * @property {number} [largeUp] Desktop screen upper. Defaults to `1201`.
 */

/**
 * App style configuration. Merged with the JSS style at run time.
 *
 * Example: The place holder `%colors:primary%` will merge with the settings.style.colors.header value.
 * @typedef {object} StyleConfig
 * @property {LoaderStyle} [loader] Loader style.
 * @property {FontStyle} [font] Font style.
 * @property {ImagesStyle} [images] Images style.
 * @property {ColorsStyle} [colors] Colors style.
 * @property {ScreenSizes} [screen] Screen sizes.
 */

/**
 * Application settings.
 * @typedef {object} Settings
 * @property {boolean} [debug] Set the app to debug mode. Defaults to `false`.
 * @property {boolean} [minify] Load minified packages. Defaults to `true`.
 * @property {boolean} [guiAllowed] GUI allowed flag.
 * @property {object} [jss] JSS style to use. Defaults to the flat JSS style.
 * @property {boolean} [windowMode] Allow the use of multiple windows. Defaults to `true`.
 * @property {string} [packages] Packages URL.
 * @property {AppConfig} [app] App config.
 * @property {MetaConfig} [meta] Meta data config.
 * @property {StyleConfig} [style] Style config.
 */

/**
 * @callback ControllerCallback
 * @param {ViewerComponent} comp Component.
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
 * @property {boolean} [first] If `true` sets as dashboard page.
 * @property {boolean} [temp] If `true` the page uses temp data.
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
