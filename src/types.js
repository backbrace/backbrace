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
 * Alias for `ArrayLike`.
 * @typedef {ArrayLike} ArrayLike
 */

/**
 * JQuery library.
 * @typedef {JQuery} JQuery
 */

/**
 * JQuery promise.
 * @typedef {JQueryPromise} JQueryPromise
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
 * @property {string} [name] App name (displays in header if there is no logo image). Defaults to `Jumpstart App`.
 * @property {string} [version] App version. Defaults to `0.1.0`.
 * @property {string} [title] App tite (displays in browser window). Defaults to `New Jumpstart App`.
 * @property {string} [description] App description. Defaults to `Web App powered by Jumpstart`.
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
 * @property {string} [header] Header background color. Defaults to `#3498db`.
 * @property {string} [headertext] Header foreground color. Defaults to `#FFF`.
 * @property {string} [headerborder] Header border style. Defaults to `none`.
 * @property {string} [title] Window title background color. Defaults to `#FFF`.
 * @property {string} [titletext] Window title foreground color. Defaults to `#000`.
 * @property {string} [menuicon] Menu icon color. Defaults to `#FFF`.
 * @property {string} [default] Window background color. Defaults to `#FFF`.
 * @property {string} [defaulttext] Window foreground color. Defaults to `#000`.
 * @property {string} [hover] Hover background color. Defaults to `whitesmoke`.
 * @property {string} [hovertext] Hover foreground color. Defaults to `#000`.
 * @property {string} [alertbutton] Alert button background color. Defaults to `#3498db`.
 * @property {string} [alertbuttontext] Alert button foreground color. Defaults to `#FFF`.
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
 * Example: The place holder `%colors:header%` will merge with the settings.style.colors.header value.
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
 * @property {boolean} [requireAuth] Require the user to log in. Defaults to `true`.
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
 * @property {string} tab Tab to show the field in.
 * @property {string} width Width of the field. Defaults to `100px`.
 * @property {boolean} hidden Don't display the field on the page.
 * @property {boolean} editable Readonly field.
 * @property {boolean} password If `true` display a password field.
 * @property {string} className Classes to add to the field.
 */

/**
 * @typedef {object} PageActionMeta
 * @property {string} name Name of the action.
 * @property {string} text Caption of the action.
 * @property {string} icon Icon to use on the button.
 * @property {string} iconColor Icon color. Defaults to header color.
 * @property {string} className Classes to add to the button.
 */

/**
 * @typedef {object} PageTabMeta
 * @property {string} name Name of the tab.
 * @property {string} text Caption of the tab.
 * @property {string} pageName Display a subpage in this tab.
 * @property {string} icon Tab icon.
 * @property {string} className Classes to add to the tab.
 */

/**
 * @typedef {object} PageMeta
 * @property {string} name Name of the page.
 * @property {string} caption Caption of the page.
 * @property {string} component Component for the whole page (defaults to `cardpage`).
 * @property {string} controller Page controller.
 * @property {string} icon Icon to use for the page.
 * @property {boolean} factbox Display in the factbox area.
 * @property {PageFieldMeta[]} fields Page fields.
 * @property {PageActionMeta[]} actions Page actions.
 * @property {PageTabMeta[]} tabs Page tabs.
 */
