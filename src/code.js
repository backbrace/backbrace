/**
 * Code execution module. Handles execution of async code.
 * @module
 */
'use strict';

var $log = require('./log'),
    $util = require('./util'),
    CodeThread = require('./classes/codethread'),
    testMode = false;

/** @type {CodeThread} */
var currentThread = null;
/** @type {CodeThread[]} */
var threads = [];

function reset() {

    // Clear the current queue.
    if (currentThread)
        currentThread.queue = [];

    // Kill off all threads.
    $log.debug('Clearing all threads.');
    threads = [];
    currentThread = null;

}

function runNextThread() {
    currentThread = null;
    if (threads.length === 0)
        return;
    currentThread = threads.shift();
    currentThread.run(runNextThread);
}

/**
 * Setup a new block of functions to run.
 * @returns {JQueryPromise} Promise to run the functions.
 */
function block() {

    var $app = require('./app'), // We require $app down here so we don't get a dependency loop.
        $ = require('../external/jquery')();

    if (!currentThread)
        $app.error('Attempted to start a codeblock without a thread');

    var w = $.Deferred();

    CodeThread.prototype.createQueue.apply(currentThread, arguments);

    return w.promise();
}

/**
 * Loop through an array using `$code.block`.
 * @param {Array} obj Array to iterate through.
 * @param {Function} iterator Iterator function to call.
 * @param {Object} [context] Context to run the iterator function.
 * @returns {JQueryPromise} Promise to return after we are done looping.
 */
function each(obj, iterator, context) {

    var func = function(key) {
        return block(

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

    if (func.length > 0)
        return block(
            function() {
                return func(0);
            }
        );
}

/**
 * Start a new code thread to execute code when possible.
 * @returns {void}
 */
function thread() {

    var args = arguments,
        func = function(){
            return block.apply(this,args);
        },
        thread = new CodeThread(func);

    $log.debug('Created new thread');

    // Add the thread to the queue.
    threads.push(thread);

    // If nothing is running, run this thread.
    if (!currentThread)
        runNextThread();
}

module.exports = {
    threads: threads,
    currentThread: currentThread,
    testMode: testMode,
    block: block,
    each: each,
    thread: thread,
    reset: reset
};
