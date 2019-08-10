/**
 * @class
 * @extends {Error}
 * @description
 * Route error class.
 */
export class RouteError extends Error {

    /**
     * @constructor
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, RouteError);
    }

}
