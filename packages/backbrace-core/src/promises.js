/**
 * Promise execution module. Handles execution of async code.
 * @module promises
 * @private
 */

import { error } from './error';
import { debug as logDebug, object as logObject } from './log';
import { PromiseQueue } from './promisequeue';

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
 * Run the next promise queue in the queue.
 * @ignore
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

    return PromiseQueue.prototype.createQueue.apply(currentQueue, args);
}

/**
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
 * Start a new promise queue to execute code when possible.
 * @param {...genericFunction} args Functions to run.
 * @returns {PromiseQueue} Returns the promise queue.
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

    return queue;
}
