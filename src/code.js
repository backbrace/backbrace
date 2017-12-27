/**
 * Code execution module. Handles execution of async code.
 * @module
 */
'use strict';

var $log = require('./log'),
    $util = require('./util'),
    CodeThread = require('./Classes/CodeThread'),
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
 * @returns {JQueryPromise}
 */
function block() {

    var $app = require('./app'),
        $ = require('../external/jquery');

    if (!currentThread)
        $app.error('Attempted to start a codeblock without a thread');

    var w = $.Deferred();

    CodeThread.prototype.createQueue.apply(currentThread, arguments);

    return w.promise();
}

/**
 * Start a new code thread to execute code when possible.
 * @param {Function} func - Function to execute when possible.
 * @param {number} [id] - Unique ID of the thread.
 */
function thread(func, id) {

    var thread = new CodeThread(func, id);
    $log.debug($util.formatString('Created new thread: #{0}', thread.id));

    // Check if thread already exists.
    if (id)
        for (var i = 0; i < threads.length; i++)
            if (threads[i].id === id) {
                $log.debug($util.formatString('Thread {0} already exists.', id));
                return;
            }

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
    thread: thread,
    reset: reset
};
