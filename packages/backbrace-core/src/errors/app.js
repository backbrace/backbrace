import { ComponentError } from './component';

/**
 * @class AppError
 * @augments ComponentError
 * @description
 * Application error class.
 */
export class AppError extends ComponentError {

    /**
     * @constructs AppError
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, AppError);
    }
}
