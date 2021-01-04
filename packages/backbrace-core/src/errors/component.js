import { AppError } from './app';

/**
 * @class ComponentError
 * @augments AppError
 * @description
 * Component error class. Used as the base error for all components.
 */
export class ComponentError extends AppError {

    /**
     * @constructs ComponentError
     */
    constructor(...args) {

        super(...args);

        /**
         * @description
         * Component which caused the error.
         * @type {import('../components/component').Component}
         */
        this.component = null;

        AppError.captureStackTrace(this, ComponentError);
    }
}
