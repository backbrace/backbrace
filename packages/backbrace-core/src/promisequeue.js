import $ from 'jquery';
import { debug as logDebug } from './log';
import { uid } from './util';
import { errorHandler } from './app';

/**
 * @class PromiseQueue
 * @description
 * Promises Queue class.
 */
export class PromiseQueue {

    /**
     * @constructs PromiseQueue
     * @param {function():*} func Queue function to execute.
     */
    constructor(func) {
        /**
         * @type {number}
         * @description
         * ID for the queue.
         */
        this.id = uid();
        /**
         * @type {function():*}
         * @description
         * Function to execute.
         */
        this.func = func;
        /**
         * @type {genericFunction[][]}
         * @description
         * Function queue.
         */
        this.queue = [];
        /**
         * @type {function():*}
         * @description
         * Function that is currently executing.
         */
        this.currFunction = null;
        /**
         * @type {promiseErrorHandler}
         * @description
         * Error handler.
         */
        this.errorHandler = null;
    }

    /**
     * @description
     * Create a new promise queue and run the first function.
     * @param {...genericFunction} args Functions to run.
     * @returns {JQueryPromise} Promises to run the first function.
     */
    createQueue(...args) {

        // Create a new queue.
        let queue = [];

        // Add the function blocks to the new queue if they are not null.
        queue = $.grep(args, function(v) {
            return v !== null;
        });

        // Add to the queue.
        this.queue.push(queue);

        logDebug(`Created new queue: #${this.queue.length - 1} with ${queue.length} functions.`);

        // Resolve the first function in the queue.
        return this.resolveQueue(null);
    }

    /**
     * @description
     * Run the current function in the queue. Catch any errors.
     * @param {*} [result] Result from the last method to send into the current function.
     * @returns {JQueryPromise} Promises to resolve the queue.
     */
    resolveQueue(result) {

        const i = this.queue.length - 1,
            arr = [result];

        if (this.queue.length === 0)
            return;

        logDebug(`Attempting next function in Queue #${i}.`);

        this.currFunction = this.queue[i][0];

        if (this.queue[i].length <= 1) {
            logDebug(`Last function in Queue #${i}.`);
            // Remove a level.
            this.queue.splice(this.queue.length - 1, 1);
        }

        // Don't run null functions.
        if (this.currFunction == null) {
            logDebug('No function! Running next function.');
            return this.runNextFunction();
        }

        logDebug(this.currFunction.toString());

        return $.when(
            // Run the function.
            this.currFunction.apply(null, arr)
        ).then((result2) => this.runNextFunction(result2)).catch((e) => {
            errorHandler(e);
            if (this.errorHandler)
                this.errorHandler(e);
        });
    }

    /**
     * @description
     * Run the next function in the queue.
     * @param {*} [result] Result from the last method to send into the next function.
     * @returns {JQueryPromise} Promises to run the next function.
     */
    runNextFunction(result) {

        logDebug('Finished function.');

        if (this.queue.length > 0) {
            this.queue[this.queue.length - 1].shift();
            return this.resolveQueue(result);
        }
    }

    /**
     * @description
     * Run the promise queue.
     * @param {function():void} callback Callback function to run.
     * @returns {void}
     */
    run(callback) {

        logDebug(`Started Promise Queue: ${this.id}`);

        this.createQueue(

            () => this.func(),

            () => {
                logDebug(`Finished Promise Queue: #${this.id}`);
                if (callback)
                    callback();
            }

        );
    }

    /**
     * @description
     * Insert functions into the start of the current promiseblock.
     * @param {...genericFunction} args Functions to run.
     * @returns {void}
     */
    insert(...args) {

        //Create a queue if one does not exist.
        if (this.queue.length === 0)
            this.queue[this.queue.length] = [];

        const currQueue = this.queue[this.queue.length - 1];

        //Find insert point in current block.
        let index = 0;
        for (index = 1; index < currQueue.length; index++) {
            const method = currQueue[index];
            if (method !== null)
                if (method.toString().indexOf('\'inserted\';') === -1)
                    break;
        }

        if (index === 0)
            index += 1;

        //Add the async functions to the existing queue.
        for (let arg of args) {
            currQueue.splice(index, 0, arg);
            index += 1;
        }
    }

    /**
     * Error handler.
     * @param {promiseErrorHandler} fn Error handler.
     * @returns {void}
     */
    error(fn) {
        this.errorHandler = fn;
    }
}
