import { debug as logDebug, object as logObject } from '../log';
import { uid, setZeroTimeout, noop } from '../util';
import { get as getJQuery } from '../providers/jquery';

/**
 * @class
 * @description
 * Code thread class.
 */
export class CodeThread {

    /**
     * @constructor
     * @param {function()} func Thread function to execute.
     * @param {ErrorHandler} [onerror] Error handler.
     */
    constructor(func, onerror) {
        /**
         * @type {number}
         * @description
         * ID for the thread.
         */
        this.id = uid();
        /**
         * @type {function()}
         * @description
         * Function to execute.
         */
        this.func = func;
        /**
         * @type {ErrorHandler}
         * @description
         * Error handler.
         */
        this.onerror = onerror || noop;
        /**
         * @type {GenericFunction[][]}
         * @description
         * Function queue.
         */
        this.queue = [];
    }

    /**
     * @description
     * Create a new code queue and run the first function.
     * @param {...GenericFunction} args Functions to run.
     * @returns {void}
     */
    createQueue(...args) {

        // Create a new queue.
        const $ = getJQuery();
        let queue = [];

        // Add the function blocks to the new queue if they are not null.
        queue = $.grep(args, function(v) {
            return v !== null;
        });

        // Add to the queue.
        this.queue.push(queue);

        logDebug(`Created new queue: #${this.queue.length - 1} with ${queue.length} functions.`);

        // Resolve the first function in the queue.
        setZeroTimeout(() => this.resolveQueue(null));
    }

    /**
     * @description
     * Run the current function in the queue. Catch any errors.
     * @param {*} [result] Result from the last method to send into the current function.
     * @returns {void}
     */
    resolveQueue(result) {

        const $ = getJQuery(),
            i = this.queue.length - 1,
            arr = [result];

        if (this.queue.length === 0)
            return;

        logDebug(`Attempting next function in Queue #${i}.`);

        let func = this.queue[i][0];

        if (this.queue[i].length <= 1) {
            logDebug(`Last function in Queue #${i}.`);
            // Remove a level.
            this.queue.splice(this.queue.length - 1, 1);
        }

        // Don't run null functions.
        if (func == null) {
            logDebug('No function! Running next function.');
            this.runNextFunction();
            return;
        }

        logDebug(func.toString());

        try {

            if (func.toString().indexOf('return') === -1) {
                logDebug('Skipping $.when...');
                return this.runNextFunction(func.apply(null, arr));
            }

            $.when(
                // Run the function.
                func.apply(null, arr)
            ).then((result2) => this.runNextFunction(result2));

        } catch (e) {

            // Log the method for debugging purposes.
            logObject(func);

            // Check if the error has been handled.
            let msg = e.message || e;
            if (msg !== 'ERROR_HANDLED') {
                this.onerror(e);
            }
        }
    }

    /**
     * @description
     * Run the next function in the queue.
     * @param {*} [result] Result from the last method to send into the next function.
     * @returns {void}
     */
    runNextFunction(result) {

        logDebug('Finished function.');

        if (this.queue.length > 0) {
            this.queue[this.queue.length - 1].shift();
            setZeroTimeout(() => this.resolveQueue(result));
        }
    }

    /**
     * @description
     * Run the code thread.
     * @param {function()} callback Callback function to run.
     * @returns {void}
     */
    run(callback) {

        logDebug(`Started Thread: ${this.id}`);

        this.createQueue(

            () => this.func(),

            () => {
                logDebug(`Finished Thread: #${this.id}`);
                if (callback)
                    callback();
            }

        );
    }

    /**
     * @description
     * Insert functions into the start of the current codeblock.
     * @param {...GenericFunction} args Functions to run.
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
}
