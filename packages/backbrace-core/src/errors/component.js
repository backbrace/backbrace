/**
 * @class ComponentError
 * @augments Error
 * @description
 * Component error class.
 */
export class ComponentError extends Error {

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

        Error.captureStackTrace(this, ComponentError);
    }
}
