/**
 * @class AppError
 * @augments Error
 * @description
 * Application error class. Used as a base for all errors.
 */
export class AppError extends Error {

    /**
     * @constructs AppError
     */
    constructor(...args) {

        super(...args);

        Error.captureStackTrace(this, AppError);
    }

}
