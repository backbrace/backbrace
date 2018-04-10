'use strict';

var $log = require('../log'),
    $util = require('../util');

/**
 * Code Thread class.
 * @class
 * @private
 * @param {Function} func Thread function to execute.
 */
function CodeThread(func) {
    this.func = func;
    this.queue = [];
}

/**
 * Create a new code queue and run the first function.
 * @returns {void}
 */
CodeThread.prototype.createQueue = function() {

    // Create a new queue.
    var $ = require('../../external/jquery')(),
        queue = [],
        self = this;

    // Add the function blocks to the new queue if they are not null.
    queue = $.grep(arguments, function(v) {
        return v !== null;
    });

    // Add to the queue.
    this.queue.push(queue);

    $log.debug($util.formatString('Created new queue: #{0} with {1} functions.',
        (this.queue.length - 1), queue.length));

    // Resolve the first function in the queue.
    $util.setZeroTimeout(function() {
        self.resolveQueue(null);
    });
};

/**
 * Run the current function in the queue. Catch any errors.
 * @param {*} result Result from the last method to send into the current function.
 * @returns {void}
 */
CodeThread.prototype.resolveQueue = function(result) {

    var $ = require('../../external/jquery')(),
        i = this.queue.length - 1,
        arr = [result],
        func,
        self = this;

    if (this.queue.length === 0)
        return;

    $log.debug($util.formatString('Attempting next function in Queue #{0}.', i));

    func = this.queue[i][0];

    if (this.queue[i].length <= 1) {
        $log.debug($util.formatString('Last function in Queue #{0}.', i));
        // Remove a level.
        this.queue.splice(this.queue.length - 1, 1);
    }

    // Don't run null functions.
    if (func == null) {
        $log.debug('No function! Running next function.');
        this.runNextFunction();
        return;
    }

    $log.debug(func.toString());

    try {

        if (func.toString().indexOf('return') === -1) {
            $log.debug('Skipping $.when...');
            return this.runNextFunction(func.apply(null, arr));
        }

        $.when(
            // Run the function.
            func.apply(null, arr)
        ).then(function(result2) {
            self.runNextFunction(result2);
        });

    } catch (e) {

        // Log the method for debugging purposes.
        $log.object(func);

        // Check if the error has been handled.
        var msg = e.message || e;
        if (msg !== 'ERROR_HANDLED') {
            var $app = require('../app');
            $app.error(e);
        }
    }
};

CodeThread.prototype.runNextFunction = function(result) {

    var self = this;

    $log.debug('Finished function.');

    if (this.queue.length > 0) {
        this.queue[this.queue.length - 1].shift();
        $util.setZeroTimeout(function runNextFunction() {
            self.resolveQueue(result);
        });
    }
};

CodeThread.prototype.run = function(callback) {

    var self = this;

    $log.debug($util.formatString('Started Thread: #{0}.', this.id));

    this.createQueue(

        self.func,

        function() {
            $log.debug($util.formatString('Finished Thread: #{0}.', self.id));
            if (callback)
                callback();
        }

    );
};

module.exports = CodeThread;
