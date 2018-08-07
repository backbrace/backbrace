/**
 * Event module. Allows events to be defined and subscribed to.
 * @module event
 * @private
 */

import { codeeach } from './code';

/**
 * @type {Map<string, Function[]>}
 */
const event = new Map();

/**
 * @description
 * Check if an event exists.
 * @param {string} name Name of the event.
 * @returns {boolean} Returns `true` if the event exists.
 */
export function exists(name) {
    return event.has(name);
}

/**
 * @description
 * Unbind an event.
 * @param {string} name Name of the event.
 * @returns {void}
 */
export function unbind(name) {
    event.delete(name);
}

/**
 * @description
 * Bind an event.
 * @param {string} name Name of the event.
 * @param {Function} handler Event handler.
 * @param {boolean} [clear] Clear the existing event.
 * @returns {void}
 */
export function bind(name, handler, clear) {
    if (clear)
        unbind(name);
    if (exists(name)) {
        event.get(name).push(handler);
    } else {
        event.set(name, [handler]);
    }
}

/**
 * @description
 * Fire an event and wait for the repsonse.
 * @param {string} name Name of the event.
 * @param {...*} args Arguments to pass into the event.
 * @returns {JQueryPromise} Promise to return after firing the event/s.
 */
export function fireWait(name, ...args) {

    let handlers = event.get(name);

    if (handlers)
        if (handlers.length > 0)
            return codeeach(handlers, function(handler) {
                return handler.apply(null, args);
            });
}

/**
 * @description
 * Fire an event.
 * @param {string} name Name of the event.
 * @param {...*} args Arguments to pass into the event.
 * @returns {void}.
 */
export function fire(name, ...args) {

    let handlers = event.get(name);
    if (handlers) {
        for (let handler of handlers) {
            if (handlers.length === 1) {
                return handler.apply(null, args);
            } else {
                handler.apply(null, args);
            }
        }
    }
}
