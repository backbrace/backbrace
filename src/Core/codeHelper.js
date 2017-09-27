'use strict';

function CodeThread(func, id) {

    this.id = id || $js.nextID();
    this.func = func;
    this.queue = [];

    $event.fire('ThreadCreated');
    $log.debug($js.formatString('Created new thread: #{0}', this.id));
}

/**
 * Create a new code queue and run the first function.
 * @param {...*} args - Functions to add to the queue.
 */
CodeThread.prototype.createQueue = function(args) {

    // Create a new queue.
    var queue = [],
        _self = this;

    // Add the function blocks to the new queue if they are not null.
    // @ts-ignore
    queue = $.grep(arguments, function(v) {
        return v !== null;
    });

    // Add to the queue.
    this.queue.push(queue);

    $log.debug($js.formatString('Created new queue: #{0} with {1} functions.',
        (this.queue.length - 1), queue.length));

    // Resolve the first function in the queue.
    $code.setZeroTimeout(function() {
        _self.resolveQueue(null);
    });
};

/**
 * Run the current function in the queue. Catch any errors.
 * @param {*} result - Result from the last method to send into the current function.
 */
CodeThread.prototype.resolveQueue = function(result) {

    var i = this.queue.length - 1,
        arr = [result],
        func,
        _self = this;

    if (this.queue.length === 0)
        return;

    $log.debug($js.formatString('Attempting next function in Queue #{0}.', i));

    func = this.queue[i][0];

    if (this.queue[i].length <= 1) {
        $log.debug($js.formatString('Last function in Queue #{0}.', i));
        // Remove a level.
        this.queue.splice(this.queue.length - 1, 1);
    }

    // Don't run null functions.
    if (func == null) {
        $log.debug('No function! Running next function.');
        this.runNextFunction();
        return;
    }

    $event.fire('CodeBlockFire', func.toString());

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
            _self.runNextFunction(result2);
        });

    } catch (e) {

        // Log the method for debugging purposes.
        $log.object(func);

        // Check if the error has been handled.
        var msg = e.message || e;
        if (msg !== 'ERROR_HANDLED')
            $js.error(e);

        if ($code.testMode)
            this.runNextFunction(result);
    }
};

CodeThread.prototype.runNextFunction = function(result) {

    var _self = this;

    $log.debug('Finished function.');

    if (this.queue.length > 0) {
        this.queue[this.queue.length - 1].shift();
        $code.setZeroTimeout(function() {
            _self.resolveQueue(result);
        });
    }
};

CodeThread.prototype.run = function(callback) {

    var _self = this;

    $log.debug($js.formatString('Started Thread: #{0}.', this.id));

    this.createQueue(

        ($event.exists('ThreadStart') ? function() {
            return $event.fireWait('ThreadStart');
        } : null),

        _self.func,

        ($event.exists('ThreadEnd') ? function() {
            return $event.fireWait('ThreadEnd');
        } : null),

        function() {
            $log.debug($js.formatString('Stopped Thread: #{0}.', _self.id));
            $event.fire('ThreadFinished');
            if (callback)
                callback();
        }

    );
};

/**
 * Code helper.
 */
var $code = (function() {

    var timeouts = [],
        messageName = 'ztm';

    function runNextThread() {
        $code.currentThread = null;
        if ($code.threads.length === 0)
            return;
        $code.currentThread = $code.threads.shift();
        $code.currentThread.run(runNextThread);
    }

    return {

        /** @type {CodeThread[]} */
        threads: [],

        /** @type {CodeThread} */
        currentThread: null,

        testMode: false,

        init: function() {
            $window.addEventListener('message', function(event) {
                if (event.source === $window && event.data === messageName) {
                    event.stopPropagation();
                    if (timeouts.length)
                        timeouts.shift()();
                }
            }, true);
        },

        /**
         * Run a function asyncroniously. Runs faster than setTimeout(fn, 0).
         * @param {Function} fn - Function to run after 0 seconds.
         */
        setZeroTimeout: function(fn) {
            timeouts.push(fn);
            $window.postMessage(messageName, '*');
        },

        block: function() {

            if (!$code.currentThread)
                $js.error('Attempted to start a codeblock without a thread');

            // @ts-ignore
            var w = jQuery.Deferred();

            CodeThread.prototype.createQueue.apply($code.currentThread, arguments);

            return w.promise();
        },

        runNext: function(func, id) {

            var thread = new CodeThread(func, id);
            $event.fire('ThreadCreated');

            // Check if thread already exists.
            if (id)
                for (var i = 0; i < $code.threads.length; i++)
                    if ($code.threads[i].id === id) {
                        $log.debug($js.formatString('Thread {0} already exists.', id));
                        return;
                    }

            // Add the thread to the queue.
            $code.threads.push(thread);

            // If nothing is running, run this thread.
            if (!$code.currentThread)
                runNextThread();
        },

        onerror: function() {

            // Clear timeout functions.
            timeouts = [];

            // Clear the current queue.
            if ($code.currentThread)
                $code.currentThread.queue = [];

            // Kill off all threads.
            $log.debug('Clearing all threads.');
            $code.threads = [];
            $code.currentThread = null;
        }

    };

})();
