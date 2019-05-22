/**
 * Promise execution module. Handles execution of async code.
 * @module promises
 * @private
 */

import { error } from './error';
import $ from 'jquery';
import { debug as logDebug, object as logObject } from './log';
import { PromiseQueue } from './classes/promisequeue';

const promisesError = error('promises');

/**
 * @type {PromiseQueue}
 * @ignore
 */
let currentQueue = null;

/**
 * @type {PromiseQueue[]}
 * @ignore
 */
let promisequeues = [];

/**
 * @method reset
 * @ignore
 * @description
 * Reset all promise queues.
 * @returns {void}
 */
export function reset() {

    // Clear the current queue.
    if (currentQueue) {

        // Output the current executing function (for debugging).
        if (currentQueue.currFunction)
            logObject(currentQueue.currFunction);

        currentQueue.queue = [];
    }

    // Kill off all queues.
    logDebug('Clearing all promise queues.');
    promisequeues = [];
    currentQueue = null;

}

/**
 * @method runNextQueue
 * @private
 * @description
 * Run the next promise queue in the queue.
 * @returns {void}
 */
function runNextQueue() {
    currentQueue = null;
    if (promisequeues.length === 0)
        return;
    currentQueue = promisequeues.shift();
    currentQueue.run(runNextQueue);
}

/**
 * @method promiseblock
 * @memberof module:backbrace
 * @description
 * Setup a new block of functions to run.
 *
 * Each function will be run in order.
 *
 * @param {...genericFunction} args Functions to run.
 * @returns {JQueryPromise<any>} Promise to run the functions.
 * @example
 * return backbrace.promiseblock(
 *  function() {
 *      // this will run first.
 *  },
 *  function() {
 *      // this will run second.
 *  }
 * );
 */
export function promiseblock(...args) {

    if (!currentQueue)
        throw promisesError('noqueue', 'Attempted to run a promise block without a promise queue');

    let w = $.Deferred();

    PromiseQueue.prototype.createQueue.apply(currentQueue, args);

    return w.promise();
}

/**
 * @method promiseinsert
 * @memberof module:backbrace
 * @description
 * Insert code into the current promise block.
 * @param {...Function} args Functions to run.
 * @returns {void}
 */
export function promiseinsert(...args) {

    if (!currentQueue)
        throw promisesError('noqueue', 'Attempted to insert into a promise block without a promise queue');

    PromiseQueue.prototype.insert.apply(currentQueue, args);
}

/**
 * @method promiseeach
 * @memberof module:backbrace
 * @description
 * Loop through an array using `promiseblock`.
 * @template T
 * @param {ArrayLike<T>} obj Object to iterate through.
 * @param {function(T,key,ArrayLike<T>):(void|JQueryPromise<any>)} iterator Iterator function to call.
 * @param {*} [context] Context to run the iterator function.
 * @returns {JQueryPromise<any>} Promise to return after we are done looping.
 */
export function promiseeach(obj, iterator, context) {

    const func = function(key) {
        return promiseblock(

            function() {
                return iterator.call(context, obj[key], key, obj);
            },

            function(ret) {
                if (key < obj.length - 1)
                    return func(key + 1);
                return ret;
            }

        );
    };

    if (obj.length > 0)
        return promiseblock(
            function() {
                return func(0);
            }
        );
}

/**
 * @method promisequeue
 * @memberof module:backbrace
 * @description
 * Start a new promise queue to execute code when possible.
 * @param {...genericFunction} args Functions to run.
 * @returns {void}
 */
export function promisequeue(...args) {

    const func = function() {
        return promiseblock.apply(this, args);
    },
        queue = new PromiseQueue(func);

    logDebug('Created new promise queue');

    // Add the queue to the queue.
    promisequeues.push(queue);

    // If nothing is running, run this queue.
    if (!currentQueue)
        runNextQueue();
}
