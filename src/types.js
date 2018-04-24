/**
 * @typedef {(number|string)} Key
 */

/**
 * Component.
 * @typedef Component
 * @property {number} id ID of the component.
 * @property {Function} load Load the component.
 * @property {Function} unload Unload the component.
 * @property {Function} show Show the component.
 * @property {Function} hide Hide the component.
 */

/**
 * @typedef VersionInfo
 * @property {string} full Full version number. eg: 0.1.0
 */

/**
 * Server Instance
 * @typedef ServerInstance
 * @property {function():JQueryPromise} autoLogin Attempt to auto login.
 */

 /**
 * Alert instance.
 * @typedef AlertInstance
 * @property {function(string,Function,string):void} message Show a message box.
 * @property {function(string,Function,string,string,string):void} confirm Show a confirmation box.
 * @property {function(string):void} error Show an error message box.
 */

 /**
  * Icons instance.
  * @typedef IconsInstance
  * @property {function(string,string,string):string} get Get an icon by name.
  */

/**
 * App configuration.
 * @typedef AppConfig
 * @property {string} name App name (displays in header if there is no logo image). Defaults to `Jumpstart App`.
 * @property {string} version App version. Defaults to `0.1.0`.
 * @property {string} title App tite (displays in browser window). Defaults to `New Jumpstart App`.
 * @property {string} description App description. Defaults to `Web App powered by Jumpstart`.
 */

/**
 * Meta data configuration.
 * @typedef MetaConfig
 * @property {string} dir Meta data root directory. Defaults to `./meta`.
 */

/**
 * Loader style.
 * @typedef LoaderStyle
 * @property {string} zindex Loader bar z-index. Defaults to `1000`.
 * @property {string} barheight Loader bar height. Defaults to `10px`.
 * @property {string} barwidth Loader bar width. Defaults to `800px`.
 * @property {string} progressbackground Progress bar background. Defaults to `#A2CFEE`.
 * @property {string} progresscolor Progress bar foreground color. Defaults to `#3498DB`.
 * @property {string} blockerbackground Background for loader blocker. Defaults to `#ECF0F1`.
 */

/**
 * Font style.
 * @typedef FontStyle
 * @property {string} url URL for the font. Defaults to Roboto font.
 * @property {string} family Font family to use for the app. Defaults to `'Roboto', sans-serif`.
 */

/**
 * Images style.
 * @typedef ImagesStyle
 * @property {string} logo URL for the logo image (displayed in the header).
 * @property {string} menuLogo URL for the menu logo image (displayed at the top of the main menu).
 * @property {string} blocker URL for the blocker image (displayed while the loader is shown).
 */

/**
 * Colours style.
 * @typedef ColorsStyle
 * @property {string} header Header background color. Defaults to `#3498db`.
 * @property {string} headertext Header foreground color. Defaults to `#FFF`.
 * @property {string} headerborder Header border style. Defaults to `none`.
 * @property {string} title Window title background color. Defaults to `#FFF`.
 * @property {string} titletext Window title foreground color. Defaults to `#000`.
 * @property {string} menuicon Menu icon color. Defaults to `#FFF`.
 * @property {string} default Window background color. Defaults to `#FFF`.
 * @property {string} defaulttext Window foreground color. Defaults to `#000`.
 * @property {string} hover Hover background color. Defaults to `whitesmoke`.
 * @property {string} hovertext Hover foreground color. Defaults to `#000`.
 * @property {string} alertbutton Alert button background color. Defaults to `#3498db`.
 * @property {string} alertbuttontext Alert button foreground color. Defaults to `#FFF`.
 */

/**
 * App style configuration. Merged with the JSS style at run time.
 *
 * Example: The place holder `%colors:header%` will merge with the settings.style.colors.header value.
 * @typedef StyleConfig
 * @property {LoaderStyle} loader Loader style.
 * @property {FontStyle} font Font style.
 * @property {ImagesStyle} images Images style.
 * @property {ColorsStyle} colors Colors style.
 */

/**
 * Application settings.
 * @typedef Settings
 * @property {VersionInfo} VERSION_INFO Version info for Jumpstart.
 * @property {boolean} debug Set the app to debug mode. Defaults to `false`.
 * @property {boolean} minify Load minified packages. Defaults to `true`.
 * @property {boolean} mobile Mobile mode flag.
 * @property {boolean} guiAllowed GUI allowed flag.
 * @property {boolean} autoSwitch Auto switch to mobile mode if detected. Defaults to `true`.
 * @property {Object} jss JSS style to use. Defaults to the flat JSS style.
 * @property {boolean} windowMode Allow the use of multiple windows. Defaults tp `true`.
 * @property {AppConfig} app App config.
 * @property {MetaConfig} meta Meta data config.
 * @property {StyleConfig} style Style config.
 */

/**
 * @typedef HeaderOptions
 * @property {string} [menuIcon] Menu icon.
 * @property {boolean} [attachMenu] Attach a menu to the header.
 */

/**
 * @typedef PageOptions
 * @property {string} [title] Page title.
 * @property {boolean} [factbox] Show page in side container.
 * @property {boolean} [hasParent] If `true` sets the page as a child page.
 * @property {boolean} [first] If `true` sets as dashboard page.
 * @property {boolean} [temp] If `true` the page uses temp data.
 */

/**
 * @typedef WindowOptions
 * @property {string} [className] Window class style.
 * @property {string} [icon] Window icon.
 * @property {Function} [onClose] On close function of the window.
 * @property {boolean} [hasParent] If `true` sets the window as a child window.
 * @property {boolean} [closeBtn] Add a close button to the window.
 */

/**
 * @typedef PageFieldMeta
 * @property {string} name Name of the field.
 * @property {string} caption Caption of the field.
 * @property {string} type  Data type for the field.
 * @property {string} component Custom component to use for the field.
 * @property {string} tab Tab to show the field in.
 * @property {string} width Width of the field. Defaults to `100px`.
 * @property {boolean} hidden Don't display the field on the page.
 * @property {boolean} editable Readonly field.
 * @property {boolean} password If `true` display a password field.
 * @property {boolean} desktopOnly Only show in desktop mode.
 * @property {boolean} mobileOnly Only show in mobile mode.
 * @property {boolean} leftColumn Force field to show in left column.
 * @property {boolean} rightColumn Force field to show in right column.
 */

/**
 * @typedef PageActionMeta
 * @property {string} name Name of the action.
 * @property {string} text Caption of the action.
 * @property {string} icon Icon to use on the button.
 * @property {string} className Classes to add to the button.
 * @property {boolean} desktopOnly Only show in desktop mode.
 * @property {boolean} mobileOnly Only show in mobile mode.
 */

/**
 * @typedef PageTabMeta
 * @property {string} name Name of the tab.
 * @property {string} text Caption of the tab.
 * @property {string} pageName Display a subpage in this tab.
 * @property {string} icon Tab icon.
 * @property {boolean} desktopOnly Only show in desktop mode.
 * @property {boolean} mobileOnly Only show in mobile mode.
 * @property {boolean} factbox Display in the factbox area.
 */

/**
 * @typedef PageMeta
 * @property {string} name Name of the page.
 * @property {string} caption Caption of the page.
 * @property {string} component Component for the whole page (defaults to `CardComponent`).
 * @property {string} controller Page controller.
 * @property {string} icon Icon to use for the page.
 * @property {boolean} factbox Display in the factbox area.
 * @property {PageFieldMeta[]} fields Page fields.
 * @property {PageActionMeta[]} actions Page actions.
 * @property {PageTabMeta[]} tabs Page tabs.
 */
