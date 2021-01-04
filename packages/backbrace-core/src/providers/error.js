import $ from 'cash-dom';
import { error as logError } from '../log';
import { get as getWindow } from './window';
import { ComponentError } from '../errors/component';

/**
 * @class ErrorHandler
 * @description
 * Error handler class. Used with the error handler provider.
 */
export class ErrorHandler {

    /**
     * Handle an error.
     * @param {Error} err Error to handle.
     * @returns {void}
     */
    handleError(err) {

        const window = getWindow();

        // Log the error.
        logError(err);

        // Set the error state.
        if (err instanceof ComponentError) {
            if (err.component) {
                err.component.state.error = err;
                err.component.state.hasError = true;
                err.component.update();
            }
        } else if (window.document.body) {
            window.document.body.innerHTML = `<bb-error></bb-error>`;
            let e = $(window.document.body).find('bb-error')[0];
            e.err = err;
            e.update();
        }
    }

}

/**
 * Error handler provider.
 * @module errorprovider
 * @private
 */

let instance = new ErrorHandler();

/**
 * Get the current error handler.
 * @returns {ErrorHandler} Returns the error handler.
 */
export function get() {
    return instance;
}

/**
 * Set the current error handler.
 * @param {ErrorHandler} ref Error handler to set.
 * @returns {void}
 */
export function set(ref) {
    instance = ref;
}
