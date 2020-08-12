/**
 * @class RouteError
 * @augments Error
 * @description
 * Route error class.
 */
export class RouteError extends Error {

    /**
     * @constructs RouteError
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, RouteError);
    }

}
