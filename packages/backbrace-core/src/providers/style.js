import { get as getWindow } from './window';

/**
 * @class StyleHandler
 * @description
 * Style handler class. Used by the style provider.
 */
export class StyleHandler {

    /**
     * Style Load function. Runs after the style sheets have been imported.
     * @method load
     * @returns {void}
     */
    load() {
    }

    /**
     * Create a progress meter element.
     * @returns {HTMLElement}
     */
    progress() {
        return null;
    }

    /**
     * Show a message alert.
     * @async
     * @param {string} msg Message to display.
     * @param {string} title Title of the alert.
     * @returns {Promise<void>}
     */
    async message(msg, title) {
        let window = getWindow();
        window.alert(msg);
    }

    /**
     * Show a confirmation message.
     * @async
     * @param {*} msg Message to display.
     * @param {*} title Title of the alert.
     * @param {*} yescaption Caption of the 'Yes' option.
     * @param {*} nocaption Caption of the 'No' option.
     * @returns {Promise<boolean>} Returns `true` if the user clicked the yes option.
     */
    async confirm(msg, title, yescaption, nocaption) {
        let window = getWindow(),
            ret = window.confirm(msg);
        return ret;
    }

    /**
     * Show an error alert.
     * @async
     * @param {string} msg Error message.
     * @returns {Promise<void>}
     */
    async error(msg) {
        let window = getWindow();
        window.alert(msg);
    }

    /**
     * Get an icon.
     * @param {string} name Name of the icon.
     * @returns {HTMLElement}
     */
    icon(name) {
        return null;
    }

    /**
     * Invoked after the page updates.
     * @param {import('../components/page').Page} page Page component.
     * @returns {void}
     */
    pageUpdated(page) {
    }

}

/**
 * Style provider.
 * @module styleprovider
 * @private
 */

let instance = new StyleHandler();

/**
 * Get the current style handler.
 * @returns {StyleHandler}.
 */
export function get() {
    return instance;
}

/**
 * Set the current style handler.
 * @param {StyleHandler} ref Style handler to set.
 * @returns {void}
 */
export function set(ref) {
    instance = ref;
}
