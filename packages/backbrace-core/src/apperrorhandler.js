import { error as logError } from './log';

import { AppError } from './errors/app';
import { ComponentError } from './errors/component';

import { ErrorHandler } from './providers/error';
import { get as getStyle } from './providers/style';
import { get as getWindow } from './providers/window';

/**
 * @class AppErrorHandler
 * @augments ErrorHandler
 * @private
 * @description
 * App error handler.
 */
export class AppErrorHandler extends ErrorHandler {

    /**
     * Handle an error.
     * @param {Error} err Error to handle.
     * @returns {void}
     */
    handleError(err) {

        const style = getStyle();

        // Log the error.
        logError(err);

        // Show error message.
        if (err instanceof AppError) {
            style.error(err.message);
        } else if (err instanceof ComponentError) {
            // Set the error state.
            if (err.component) {
                // Delay updating the state.
                getWindow().setTimeout(() => {
                    err.component.state.error = err;
                    err.component.state.hasError = true;
                }, 10);
            }
        }
    }
}
