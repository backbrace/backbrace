/**
* Type definitions for jumpstartjs
* Project: https://zoomapps.visualstudio.com/Zoom%20Apps/_git/Jumpstart.js
* Definitions by: tsd-doc
*/

/**
 * @typedef {(number|string)} Key
 */
declare type Key = number | string;

/**
 * Alias for `Function`. Use this where you have repeatable function params.
 * @typedef {Function} GenericFunction
 * @param {...*} [args] Function arguments.
 */
declare type GenericFunction = (...args?: any[])=>void;

/**
 * Error handler function.
 * @typedef {Function} ErrorHandler
 * @param {(string|Error)} msg Error message.
 * @param {...*} [args] Function arguments.
 */
declare type ErrorHandler = (msg: string | Error, ...args?: any[])=>void;

/**
 * Action runner function.
 * @typedef {Function} ActionRunner
 * @param {PageActionMeta} action Action meta data.
 * @param {Function} func Function to run.
 * @returns {void}
 */
declare type ActionRunner = (action: PageActionMeta, func: ()=>any)=>void;

/**
 * Alias for `ArrayLike`.
 * @typedef {ArrayLike} ArrayLike
 */
declare type ArrayLike = ArrayLike;

/**
 * JQuery library.
 * @typedef {JQuery} JQuery
 */
declare type JQuery = JQuery;

/**
 * JQuery promise.
 * @typedef {JQueryPromise} JQueryPromise
 */
declare type JQueryPromise = JQueryPromise;

/**
 * @typedef {Function} ErrorInstance
 * @param {string} code Error code.
 * @param {string} message Error message.
 * @param {...*} args Message arguments.
 * @returns {Error} Returns new error object.
 */
declare type ErrorInstance = (code: string, message: string, ...args: any[])=>Error;

/**
 * Server Instance
 * @typedef {object} ServerInstance
 * @property {function():(JQueryPromise|void)} autoLogin Attempt to auto login.
 */
declare type ServerInstance = {
    /**
     * Attempt to auto login.
     */
    autoLogin: ()=>any;
};

/**
 * @callback AlertInstanceMessage
 * @param {string} msg Message to display.
 * @param {function()} [callbackFn] Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @returns {void}
 */
declare type AlertInstanceMessage = (msg: string, callbackFn?: ()=>any, title?: string)=>void;

/**
 * @callback AlertInstanceConfirmCallback
 * @param {boolean} ret `true` if the user clicked the `OK` button.
 * @returns {void}
 */
declare type AlertInstanceConfirmCallback = (ret: boolean)=>void;

/**
 * @callback AlertInstanceConfirm
 * @param {string} msg Message to display.
 * @param {AlertInstanceConfirmCallback} callbackFn Callback function to execute after the alert is dismissed.
 * @param {string} [title] Title of the alert.
 * @param {string} [yescaption] Caption of the "yes" button.
 * @param {string} [nocaption] Caption of the "no" button.
 * @returns {void}
 */
declare type AlertInstanceConfirm = (msg: string, callbackFn: AlertInstanceConfirmCallback, title?: string, yescaption?: string, nocaption?: string)=>void;

/**
 * @callback AlertInstanceError
 * @param {string} msg Message to display.
 * @returns {void}
 */
declare type AlertInstanceError = (msg: string)=>void;

/**
 * Alert instance.
 * @typedef {object} AlertInstance
 * @property {AlertInstanceMessage} message Show a message box.
 * @property {AlertInstanceConfirm} confirm Show a confirmation box.
 * @property {AlertInstanceError} error Show an error message box.
 */
declare type AlertInstance = {
    /**
     * Show a message box.
     */
    message: AlertInstanceMessage;
    /**
     * Show a confirmation box.
     */
    confirm: AlertInstanceConfirm;
    /**
     * Show an error message box.
     */
    error: AlertInstanceError;
};

/**
 * @callback IconsInstanceGet
 * @param {string} [name] Name of the icon.
 * @param {string} [className] Classes to add to the icon.
 * @returns {string} Icon html string.
 */
declare type IconsInstanceGet = (name?: string, className?: string)=>string;

/**
 * Icons instance.
 * @typedef {object} IconsInstance
 * @property {IconsInstanceGet} get Get an icon by name.
 */
declare type IconsInstance = {
    /**
     * Get an icon by name.
     */
    get: IconsInstanceGet;
};

/**
 * App configuration.
 * @typedef {object} AppConfig
 * @property {string} [name] App name (displays in header if there is no logo image). Defaults to `Jumpstart App`.
 * @property {string} [version] App version. Defaults to `0.1.0`.
 * @property {string} [title] App tite (displays in browser window). Defaults to `New Jumpstart App`.
 * @property {string} [description] App description. Defaults to `Web App powered by Jumpstart`.
 */
declare type AppConfig = {
    /**
     * App name (displays in header if there is no logo image). Defaults to `Jumpstart App`.
     */
    name?: string;
    /**
     * App version. Defaults to `0.1.0`.
     */
    version?: string;
    /**
     * App tite (displays in browser window). Defaults to `New Jumpstart App`.
     */
    title?: string;
    /**
     * App description. Defaults to `Web App powered by Jumpstart`.
     */
    description?: string;
};

/**
 * Meta data configuration.
 * @typedef {object} MetaConfig
 * @property {string} [dir] Meta data root directory. Defaults to `./meta`.
 */
declare type MetaConfig = {
    /**
     * Meta data root directory. Defaults to `./meta`.
     */
    dir?: string;
};

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
declare type LoaderStyle = {
    /**
     * Loader bar z-index. Defaults to `1000`.
     */
    zindex?: string;
    /**
     * Loader bar height. Defaults to `10px`.
     */
    barheight?: string;
    /**
     * Loader bar width. Defaults to `800px`.
     */
    barwidth?: string;
    /**
     * Progress bar background. Defaults to `#A2CFEE`.
     */
    progressbackground?: string;
    /**
     * Progress bar foreground color. Defaults to `#3498DB`.
     */
    progresscolor?: string;
    /**
     * Background for loader blocker. Defaults to `#ECF0F1`.
     */
    blockerbackground?: string;
};

/**
 * Font style.
 * @typedef {object} FontStyle
 * @property {string} [url] URL for the font. Defaults to Roboto font.
 * @property {string} [family] Font family to use for the app. Defaults to `'Roboto', sans-serif`.
 * @property {string} [size] Font size. Defaults to `16px`.
 */
declare type FontStyle = {
    /**
     * URL for the font. Defaults to Roboto font.
     */
    url?: string;
    /**
     * Font family to use for the app. Defaults to `'Roboto', sans-serif`.
     */
    family?: string;
    /**
     * Font size. Defaults to `16px`.
     */
    size?: string;
};

/**
 * Images style.
 * @typedef {object} ImagesStyle
 * @property {string} [logo] URL for the logo image (displayed in the header).
 * @property {string} [menuLogo] URL for the menu logo image (displayed at the top of the main menu).
 * @property {string} [blocker] URL for the blocker image (displayed while the loader is shown).
 */
declare type ImagesStyle = {
    /**
     * URL for the logo image (displayed in the header).
     */
    logo?: string;
    /**
     * URL for the menu logo image (displayed at the top of the main menu).
     */
    menuLogo?: string;
    /**
     * URL for the blocker image (displayed while the loader is shown).
     */
    blocker?: string;
};

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
declare type ColorsStyle = {
    /**
     * Header background color. Defaults to `#3498db`.
     */
    header?: string;
    /**
     * Header foreground color. Defaults to `#FFF`.
     */
    headertext?: string;
    /**
     * Header border style. Defaults to `none`.
     */
    headerborder?: string;
    /**
     * Window title background color. Defaults to `#FFF`.
     */
    title?: string;
    /**
     * Window title foreground color. Defaults to `#000`.
     */
    titletext?: string;
    /**
     * Menu icon color. Defaults to `#FFF`.
     */
    menuicon?: string;
    /**
     * Window background color. Defaults to `#FFF`.
     */
    default?: string;
    /**
     * Window foreground color. Defaults to `#000`.
     */
    defaulttext?: string;
    /**
     * Hover background color. Defaults to `whitesmoke`.
     */
    hover?: string;
    /**
     * Hover foreground color. Defaults to `#000`.
     */
    hovertext?: string;
    /**
     * Alert button background color. Defaults to `#3498db`.
     */
    alertbutton?: string;
    /**
     * Alert button foreground color. Defaults to `#FFF`.
     */
    alertbuttontext?: string;
};

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
declare type ScreenSizes = {
    /**
     * Mobile screen. Defaults to `600`.
     */
    small?: number;
    /**
     * Mobile screen upper. Defaults to `601`.
     */
    smallUp?: number;
    /**
     * Tablet screen. Defaults to `992`.
     */
    medium?: number;
    /**
     * Tablet screen upper. Defaults to `993`.
     */
    mediumUp?: number;
    /**
     * Desktop screen. Defaults to `1200`.
     */
    large?: number;
    /**
     * Desktop screen upper. Defaults to `1201`.
     */
    largeUp?: number;
};

/**
 * App style configuration. Merged with the JSS style at run time.
 * Example: The place holder `%colors:header%` will merge with the settings.style.colors.header value.
 * @typedef {object} StyleConfig
 * @property {LoaderStyle} [loader] Loader style.
 * @property {FontStyle} [font] Font style.
 * @property {ImagesStyle} [images] Images style.
 * @property {ColorsStyle} [colors] Colors style.
 * @property {ScreenSizes} [screen] Screen sizes.
 */
declare type StyleConfig = {
    /**
     * Loader style.
     */
    loader?: LoaderStyle;
    /**
     * Font style.
     */
    font?: FontStyle;
    /**
     * Images style.
     */
    images?: ImagesStyle;
    /**
     * Colors style.
     */
    colors?: ColorsStyle;
    /**
     * Screen sizes.
     */
    screen?: ScreenSizes;
};

/**
 * Application settings.
 * @typedef {object} Settings
 * @property {boolean} [debug] Set the app to debug mode. Defaults to `false`.
 * @property {boolean} [minify] Load minified packages. Defaults to `true`.
 * @property {boolean} [guiAllowed] GUI allowed flag.
 * @property {object} [jss] JSS style to use. Defaults to the flat JSS style.
 * @property {boolean} [windowMode] Allow the use of multiple windows. Defaults to `true`.
 * @property {AppConfig} [app] App config.
 * @property {MetaConfig} [meta] Meta data config.
 * @property {StyleConfig} [style] Style config.
 */
declare type Settings = {
    /**
     * Set the app to debug mode. Defaults to `false`.
     */
    debug?: boolean;
    /**
     * Load minified packages. Defaults to `true`.
     */
    minify?: boolean;
    /**
     * GUI allowed flag.
     */
    guiAllowed?: boolean;
    /**
     * JSS style to use. Defaults to the flat JSS style.
     */
    jss?: object;
    /**
     * Allow the use of multiple windows. Defaults to `true`.
     */
    windowMode?: boolean;
    /**
     * App config.
     */
    app?: AppConfig;
    /**
     * Meta data config.
     */
    meta?: MetaConfig;
    /**
     * Style config.
     */
    style?: StyleConfig;
};

/**
 * @callback ControllerCallback
 * @param {ViewerComponent} comp Component.
 * @returns {void}
 */
declare type ControllerCallback = (comp: ViewerComponent)=>void;

/**
 * @typedef {object} HeaderOptions
 * @property {string} [menuIcon] Menu icon.
 * @property {boolean} [attachMenu] Attach a menu to the header.
 * @property {string} [className] Header class.
 */
declare type HeaderOptions = {
    /**
     * Menu icon.
     */
    menuIcon?: string;
    /**
     * Attach a menu to the header.
     */
    attachMenu?: boolean;
    /**
     * Header class.
     */
    className?: string;
};

/**
 * @typedef {object} ViewerOptions
 * @property {string} [title] Page title.
 * @property {boolean} [hasParent] If `true` sets the page as a child page.
 * @property {boolean} [first] If `true` sets as dashboard page.
 * @property {boolean} [temp] If `true` the page uses temp data.
 */
declare type ViewerOptions = {
    /**
     * Page title.
     */
    title?: string;
    /**
     * If `true` sets the page as a child page.
     */
    hasParent?: boolean;
    /**
     * If `true` sets as dashboard page.
     */
    first?: boolean;
    /**
     * If `true` the page uses temp data.
     */
    temp?: boolean;
};

/**
 * @typedef {object} WindowOptions
 * @property {string} [icon] Window icon.
 * @property {Function} [onClose] On close function of the window.
 * @property {boolean} [hasParent] If `true` sets the window as a child window.
 * @property {boolean} [closeBtn] Add a close button to the window.
 * @property {string} [className] Window class style.
 */
declare type WindowOptions = {
    /**
     * Window icon.
     */
    icon?: string;
    /**
     * On close function of the window.
     */
    onClose?: ()=>any;
    /**
     * If `true` sets the window as a child window.
     */
    hasParent?: boolean;
    /**
     * Add a close button to the window.
     */
    closeBtn?: boolean;
    /**
     * Window class style.
     */
    className?: string;
};

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
declare type PageFieldMeta = {
    /**
     * Name of the field.
     */
    name: string;
    /**
     * Caption of the field.
     */
    caption: string;
    /**
     * Data type for the field.
     */
    type: string;
    /**
     * Custom component to use for the field.
     */
    component: string;
    /**
     * Width of the field. Defaults to `100px`.
     */
    width: string;
    /**
     * Don't display the field on the page.
     */
    hidden: boolean;
    /**
     * Readonly field.
     */
    editable: boolean;
    /**
     * Classes to add to the field.
     */
    className: string;
};

/**
 * @typedef {object} PageActionMeta
 * @property {string} name Name of the action.
 * @property {string} text Caption of the action.
 * @property {string} icon Icon to use on the button.
 * @property {string} iconColor Icon color. Defaults to header color.
 * @property {string} className Classes to add to the button.
 */
declare type PageActionMeta = {
    /**
     * Name of the action.
     */
    name: string;
    /**
     * Caption of the action.
     */
    text: string;
    /**
     * Icon to use on the button.
     */
    icon: string;
    /**
     * Icon color. Defaults to header color.
     */
    iconColor: string;
    /**
     * Classes to add to the button.
     */
    className: string;
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
declare type PageSectionMeta = {
    /**
     * Name of the section.
     */
    name: string;
    /**
     * Caption of the section.
     */
    text: string;
    /**
     * Display a subpage in this section.
     */
    pageName: string;
    /**
     * Section icon.
     */
    icon: string;
    /**
     * Classes to add to the section.
     */
    className: string;
    /**
     * Page section fields.
     */
    fields: (PageFieldMeta)[];
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
declare type PageMeta = {
    /**
     * Name of the page.
     */
    name: string;
    /**
     * Caption of the page.
     */
    caption: string;
    /**
     * Component for the whole page (defaults to `cardpage`).
     */
    component: string;
    /**
     * Page controller.
     */
    controller: string;
    /**
     * Name of the page's datasource.
     */
    tableName: string;
    /**
     * Icon to use for the page.
     */
    icon: string;
    /**
     * Page actions.
     */
    actions: (PageActionMeta)[];
    /**
     * Page sections.
     */
    sections: (PageSectionMeta)[];
};

/**
 * @typedef {object} TableColumnMeta
 * @property {string} name Name of the column.
 * @property {string} caption Caption of the column.
 * @property {string} type  Data type for the column.
 */
declare type TableColumnMeta = {
    /**
     * Name of the column.
     */
    name: string;
    /**
     * Caption of the column.
     */
    caption: string;
    /**
     * Data type for the column.
     */
    type: string;
};

/**
 * @typedef {object} TableMeta
 * @property {string} name Name of the table.
 * @property {string} controller Table controller.
 * @property {string} data Table data (if from a file).
 * @property {TableColumnMeta[]} columns Table columns.
 */
declare type TableMeta = {
    /**
     * Name of the table.
     */
    name: string;
    /**
     * Table controller.
     */
    controller: string;
    /**
     * Table data (if from a file).
     */
    data: string;
    /**
     * Table columns.
     */
    columns: (TableColumnMeta)[];
};

/**
 * @class
 * @description
 * Code thread class.
 */
declare class CodeThread {
    constructor(func: ()=>any);

    /**
     * @type {number}
     * @description
     * ID for the thread.
     */
    id: number;

    /**
     * @type {function()}
     * @description
     * Function to execute.
     */
    func: ()=>any;

    /**
     * @type {GenericFunction[][]}
     * @description
     * Function queue.
     */
    queue: ((GenericFunction)[])[];

    /**
     * @type {function()}
     * @description
     * Function that is currently executing.
     */
    currFunction: ()=>any;

    /**
     * @description
     * Create a new code queue and run the first function.
     * @param {...GenericFunction} args Functions to run.
     * @returns {void}
     */
    createQueue(...args: (GenericFunction)[]): void;

    /**
     * @description
     * Run the current function in the queue. Catch any errors.
     * @param {*} [result] Result from the last method to send into the current function.
     * @returns {void}
     */
    resolveQueue(result?: any): void;

    /**
     * @description
     * Run the next function in the queue.
     * @param {*} [result] Result from the last method to send into the next function.
     * @returns {void}
     */
    runNextFunction(result?: any): void;

    /**
     * @description
     * Run the code thread.
     * @param {function()} callback Callback function to run.
     * @returns {void}
     */
    run(callback: ()=>any): void;

    /**
     * @description
     * Insert functions into the start of the current codeblock.
     * @param {...GenericFunction} args Functions to run.
     * @returns {void}
     */
    insert(...args: (GenericFunction)[]): void;

}

/**
 * @class
 * @description
 * Component class.
 * Used as the base for all components.
 */
declare class Component {
    constructor();

    /**
     * @description
     * ID of the component.
     * @type {number}
     */
    id: number;

    /**
     * @description
     * Container for the component.
     * @type {JQuery}
     */
    container: JQuery;

    /**
     * @readonly
     * @description
     * If `true` the component is currently visible.
     * @type {boolean}
     */
    readonly visible: boolean;

    /**
     * @description
     * Set to `true` to keep the component hidden.
     * @type {boolean}
     */
    hidden: boolean;

    /**
     * @description
     * Load the component and append to `container`.
     * @param {JQuery} container Container to load into.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    load(container: JQuery): Component | JQueryPromise;

    /**
     * @description
     * Update the component with a data source.
     * @param {object} data Data to bind to the component.
     * @returns {Component|JQueryPromise} Returns itself for chaining.
     */
    update(data: object): Component | JQueryPromise;

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload(): void;

    /**
     * @description
     * Show the component if `hide` is `false`.
     * @returns {Component} Returns itself for chaining.
     */
    show(): Component;

    /**
     * @description
     * Hide the component.
     * @returns {Component} Returns itself for chaining.
     */
    hide(): Component;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Field component base class.
 */
declare class FieldComponent extends Component {
    constructor(parent: PageComponent, field: PageFieldMeta);

    /**
     * @description
     * Parent component.
     * @type {PageComponent}
     */
    parent: PageComponent;

    /**
     * @description
     * Field meta data.
     * @type {PageFieldMeta}
     */
    field: PageFieldMeta;

    /**
     * @description
     * Control part of the component.
     * @type {JQuery}
     */
    control: JQuery;

    /**
     * @description
     * Label part of the component.
     * @type {JQuery}
     */
    label: JQuery;

    /**
     * @description
     * Update the field from the data source.
     * @param {object} data Data source.
     * @returns {FieldComponent|JQueryPromise} Returns itself for chaining.
     */
    update(data: object): FieldComponent | JQueryPromise;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Page component base class.
 */
declare class PageComponent extends Component {
    constructor(viewer: ViewerComponent);

    /**
     * @description
     * Viewer component.
     * @type {ViewerComponent}
     */
    viewer: ViewerComponent;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Action button component.
 */
declare class ActionComponent extends Component {
    constructor(action: PageActionMeta, actionRunner: ActionRunner);

    /**
     * @description
     * Page action meta data.
     * @type {PageActionMeta}
     */
    action: PageActionMeta;

    /**
     * @description
     * Function to run on click.
     * @type {function()}
     */
    onclick: ()=>any;

    /**
     * @description
     * Action runner function.
     * @type {ActionRunner}
     */
    actionRunner: ActionRunner;

    /**
     * @description
     * Load the component into the container.
     * @param {JQuery} container JQuery element to load the component into.
     * @returns {ActionComponent} Returns itself for chaining.
     */
    load(container: JQuery): ActionComponent;

    /**
     * @description
     * Set the on click function.
     * @param {function()} func On click function.
     * @returns {ActionComponent} Returns itself for chaining.
     */
    click(func: ()=>any): ActionComponent;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Actions bar component.
 */
declare class ActionsComponent extends Component {
    constructor();

    /**
     * @description
     * Action components.
     * @type {Map<string, ActionComponent>}
     */
    actions: Map<string, ActionComponent>;

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload(): void;

    /**
     * @description
     * Load the component into the container.
     * @param {JQuery} container JQuery element to load the component into.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    load(container: JQuery): ActionsComponent;

    /**
     * @description
     * Add an action button.
     * @param {PageActionMeta} action Action meta data.
     * @param {ActionRunner} runfunc Action runner function.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    addAction(action: PageActionMeta, runfunc: ActionRunner): ActionsComponent;

    /**
     * @description
     * Get an action by name.
     * @param {string} name Name of the action to get.
     * @returns {ActionComponent} Returns the action.
     */
    action(name: string): ActionComponent;

    /**
     * @description
     * Show the component.
     * @returns {ActionsComponent} Returns itself for chaining.
     */
    show(): ActionsComponent;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Header component.
 */
declare class HeaderComponent extends Component {
    constructor(options?: HeaderOptions);

    /**
     * @description
     * Options for the header component.
     * @type {HeaderOptions}
     */
    options: HeaderOptions;

    /**
     * @description
     * Nav bar container.
     * @type {JQuery}
     */
    navbar: JQuery;

    /**
     * @description
     * Main menu container.
     * @type {JQuery}
     */
    menu: JQuery;

    /**
     * @description
     * Menu icon.
     * @type {JQuery}
     */
    menuIcon: JQuery;

    /**
     * @description
     * Title bar container.
     * @type {JQuery}
     */
    titleBar: JQuery;

    /**
     * @description
     * Profile image.
     * @type {JQuery}
     */
    profileImage: JQuery;

    /**
     * @description
     * If `true` the main menu is visible.
     * @type {boolean}
     */
    menuExtended: boolean;

    /**
     * @description
     * Current title.
     * @type {string}
     */
    title: string;

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload(): void;

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    load(container: JQuery): HeaderComponent;

    /**
     * @description
     * Load the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    loadMenu(): HeaderComponent;

    /**
     * @description
     * Load the profile image.
     * @param {string} url Profile image url.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    loadProfileImage(url: string): HeaderComponent;

    /**
     * @description
     * Show the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    showMenu(): HeaderComponent;

    /**
     * @description
     * Hide the main menu.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    hideMenu(): HeaderComponent;

    /**
     * @description
     * Set the title.
     * @param {string} title New title.
     * @returns {HeaderComponent} Returns itself for chaining.
     */
    setTitle(title: string): HeaderComponent;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Page viewer component. Used to display a page.
 */
declare class ViewerComponent extends Component {
    constructor(name: string, options?: ViewerOptions);

    /**
     * @description
     * Header component (mobile only).
     * @type {HeaderComponent}
     */
    header: HeaderComponent;

    /**
     * @description
     * Name of the page.
     * @type {string}
     */
    name: string;

    /**
     * @description
     * Page title.
     * @type {string}
     */
    title: string;

    /**
     * @description
     * Viewer options.
     * @type {ViewerOptions}
     */
    options: ViewerOptions;

    /**
     * @description
     * Page meta data.
     * @type {PageMeta}
     */
    page: PageMeta;

    /**
     * @description
     * Table meta data.
     * @type {TableMeta}
     */
    table: TableMeta;

    /**
     * @description
     * The page's window component.
     * @type {WindowComponent}
     */
    window: WindowComponent;

    /**
     * @description
     * Page's shortcut button.
     * @type {JQuery}
     */
    shortcutBtn: JQuery;

    /**
     * @description
     * Page actions component.
     * @type {ActionsComponent}
     */
    actions: ActionsComponent;

    /**
     * @description
     * The component that renders over the entire window.
     * @type {PageComponent}
     */
    pageComponent: PageComponent;

    /**
     * @description
     * Data source of the viewer.
     * @type {object[]}
     */
    data: object[];

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload(): void;

    /**
     * @description
     * Load the viewer component.
     * @param {JQuery} container Container to load into.
     * @returns {JQueryPromise} Promise to load the viewer component.
     */
    load(container: JQuery): JQueryPromise;

    /**
     * @description
     * Update the viewer.
     * @returns {JQueryPromise} Returns a promise to update the viewer.
     */
    update(): JQueryPromise;

    /**
     * @description
     * Run a page action.
     * @param {PageActionMeta} action Action meta data.
     * @param {Function} func Function to run.
     * @returns {void}
     */
    actionRunner(action: PageActionMeta, func: ()=>any): void;

    /**
     * @description
     * Show the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    show(): ViewerComponent;

    /**
     * @description
     * Hide the viewer component.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    hide(): ViewerComponent;

    /**
     * @description
     * Set the title of the page.
     * @param {string} title Title to change to.
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    setTitle(title: string): ViewerComponent;

    /**
     * @description
     * Animate the page into view (mobile only).
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    animateIn(): ViewerComponent;

    /**
     * @description
     * Animate the page out of view (mobile only).
     * @returns {ViewerComponent} Returns itself for chaining.
     */
    animateOut(): ViewerComponent;

}

/**
 * @class
 * @extends {Component}
 * @description
 * Window component.
 */
declare class WindowComponent extends Component {
    constructor(options?: WindowOptions);

    /**
     * @description
     * Options for the window component.
     * @type {WindowOptions}
     */
    options: WindowOptions;

    /**
     * @description
     * Main container.
     * @type {JQuery}
     */
    main: JQuery;

    /**
     * @description
     * Toolbar container.
     * @type {JQuery}
     */
    toolbar: JQuery;

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Container to load into.
     * @returns {WindowComponent} Returns itself for chaining.
     */
    load(container: JQuery): WindowComponent;

    /**
     * @description
     * Set the window's title.
     * @param {string} title Title to set.
     * @returns {WindowComponent} Returns itself for chaining.
     */
    setTitle(title: string): WindowComponent;

}

/**
 * @class
 * @extends {FieldComponent}
 * @description
 * Textbox component.
 */
declare class TextFieldComponent extends FieldComponent {
    constructor(parent: PageComponent, field: PageFieldMeta);

    /**
     * @description
     * Load the component.
     * @param {JQuery} container Conatiner to load into.
     * @returns {FieldComponent} Returns itself for chaining.
     */
    load(container: JQuery): FieldComponent;

}

/**
 * @class
 * @extends {PageComponent}
 * @description
 * Card component class.
 */
declare class CardPageComponent extends PageComponent {
    constructor(viewer: ViewerComponent);

    /**
     * @description
     * Sub window components.
     * @type {Map<string, WindowComponent>}
     */
    subwindows: Map<string, WindowComponent>;

    /**
     * @description
     * Sub page components.
     * @type {Map<string, ViewerComponent>}
     */
    subpages: Map<string, ViewerComponent>;

    /**
     * @description
     * Field components.
     * @type {Map<string, Component>}
     */
    fields: Map<string, Component>;

    /**
     * @description
     * Unload the component.
     * @returns {void}
     */
    unload(): void;

    /**
     * @description
     * Load the component.
     * @returns {JQueryPromise} Promise to load the card.
     */
    load(): JQueryPromise;

    /**
     * @description
     * Load the tabs. Tabs can either be used to group this page's fields or show subpages.
     * @returns {JQueryPromise} Promise to return after we load the tabs.
     */
    loadSections(): JQueryPromise;

    /**
     * @description
     * Load the fields for a section.
     * @param {WindowComponent} win Window to load the fields into.
     * @param {PageFieldMeta[]} fields Fields to load.
     * @returns {JQueryPromise} Promise to return after we load the fields.
     */
    loadFields(win: WindowComponent, fields: (PageFieldMeta)[]): JQueryPromise;

    /**
     * @description
     * Update the card page with a data source.
     * @param {object[]} data Array of data.
     * @returns {JQueryPromise} Returns a promise to update the card page.
     */
    update(data: object[]): JQueryPromise;

    /**
     * @description
     * Show the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    show(): PageComponent;

    /**
     * @description
     * Hide the card component.
     * @returns {PageComponent} Returns itself for chaining.
     */
    hide(): PageComponent;

}

/**
 * @class
 * @extends {PageComponent}
 * @description
 * List component.
 */
declare class ListPageComponent extends PageComponent {
    constructor(viewer: ViewerComponent);

    /**
     * @description
     * Grid control.
     * @type {JQuery}
     */
    grid: JQuery;

    /**
     * @description
     * Column names.
     * @type {string[]}
     */
    colNames: string[];

    /**
     * @description
     * JQGrid columns.
     * @type {JQueryJqGridColumn[]}
     */
    columns: any[];

    /**
     * @description
     * Load the component.
     * @returns {Component} Returns itself for chaining.
     */
    load(): Component;

}

/**
 * Jumpstart public api.
 * @module js
 */
declare namespace js {
    /**
     * Get/Set the application settings.
     * @method settings
     * @memberof module:js
     * @param {Settings} [newsettings] Settings to set.
     * @returns {Settings} Returns the app settings.
     * @example
     * // Turn on debug mode and don't minify the resources.
     * js.settings({
     *  debug: true,
     *  minify: false
     * });
     * // Get the app name.
     * var name = js.settings().app.name;
     */
    function settings(newsettings?: Settings): Settings;

    /**
     * Get/set the window provider.
     * @method window
     * @memberof module:js
     * @param {(Window|object)} [val] Window instance to set.
     * @returns {(Window|object)} Returns the window instance.
     */
    function window(val?: Window | object): Window | object;

    /**
     * Get/set the service worker.
     * @method serviceWorker
     * @memberof module:js
     * @param {ServiceWorkerRegistration} val If `defined`, sets the service worker.
     * @returns {void|ServiceWorkerRegistration} If `val` is `undefined`, returns the current service worker registration.
     */
    function serviceWorker(val: ServiceWorkerRegistration): void | ServiceWorkerRegistration;

    /**
     * Show a message dialog.
     * @method message
     * @memberof module:js
     * @param {string} msg Message to display.
     * @param {function()} [callbackFn] Callback function to execute after the dialog is dismissed.
     * @param {string} [title="Application Message"] Title of the dialog.
     * @returns {void}
     */
    function message(msg: string, callbackFn?: ()=>any, title?: string): void;

    /**
     * Execute a function after the app is loaded.
     * @method ready
     * @memberof module:js
     * @param {Function} func Function to execute.
     * @returns {void}
     */
    function ready(func: ()=>any): void;

    /**
     * Start the app.
     * @method start
     * @memberof module:js
     * @returns {void}
     */
    function start(): void;

    /**
     * Load a page.
     * @method loadPage
     * @memberof module:js
     * @param {string} name Name of the page to load.
     * @param {ViewerOptions} [options] Page viewer options.
     * @returns {void}
     */
    function loadPage(name: string, options?: ViewerOptions): void;

    /**
     * @method codeblock
     * @memberof module:js
     * @description
     * Setup a new block of functions to run.
     * Each function will be run in order.
     * @param {...GenericFunction} args Functions to run.
     * @returns {JQueryPromise} Promise to run the functions.
     * @example
     * return js.codeblock(
     *  function() {
     *      // this will run first.
     *  },
     *  function() {
     *      // this will run second.
     *  }
     * );
     */
    function codeblock(...args: (GenericFunction)[]): JQueryPromise;

    /**
     * @method codeinsert
     * @memberof module:js
     * @description
     * Insert code into the current codeblock.
     * @param {...Function} args Functions to run.
     * @returns {void}
     */
    function codeinsert(...args: ()=>any[]): void;

    /**
     * @method codeeach
     * @memberof module:js
     * @description
     * Loop through an array using `codeblock`.
     * @template T
     * @param {ArrayLike<T>} obj Object to iterate through.
     * @param {function(T,Key,ArrayLike<T>)} iterator Iterator function to call.
     * @param {*} [context] Context to run the iterator function.
     * @returns {JQueryPromise} Promise to return after we are done looping.
     */
    function codeeach<T>(obj: any, iterator: ()=>any, context?: any): JQueryPromise;

    /**
     * @method codethread
     * @memberof module:js
     * @description
     * Start a new code thread to execute code when possible.
     * @param {...GenericFunction} args Functions to run.
     * @returns {void}
     */
    function codethread(...args: (GenericFunction)[]): void;

    /**
     * Create a controller.
     * @method controller
     * @memberof module:js
     * @param {string} name Name of the controller to create.
     * @param {ControllerCallback} definition Definition of the controller.
     * @returns {void}
     */
    function controller(name: string, definition: ControllerCallback): void;

    /**
     * Log an info message.
     * @method logInfo
     * @memberof module:js
     * @param {string} msg Message to log.
     * @returns {void}
     */
    function logInfo(msg: string): void;

    /**
     * Log an error.
     * @method logError
     * @memberof module:js
     * @param {Error} err Error to log.
     * @returns {void}
     */
    function logError(err: Error): void;

    /**
     * Log a warning message.
     * @method logWarning
     * @memberof module:js
     * @param {string} msg Message to log.
     * @returns {void}
     */
    function logWarning(msg: string): void;

    /**
     * Log a debug message (If debug mode is turned on).
     * @method logDebug
     * @memberof module:js
     * @param {string} msg Message to log.
     * @returns {void}
     */
    function logDebug(msg: string): void;

    /**
     * Log an object.
     * @method logObject
     * @memberof module:js
     * @param {*} obj Object to log.
     * @returns {void}
     */
    function logObject(obj: any): void;

}

