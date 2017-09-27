'use strict';

/**
 * JumpStart service.
 * @module core
 */
var $js = (function() {

  var uid = 1;

  return {

    /**
     * Version info for JumpStart.
     * @type {object}
     */
    version: {
      // These placeholder strings will be replaced by grunt's `build` task.
      full: '"JS_VERSION_FULL"'
    },

    mobile: false,

    suppressNextError: false,

    guiAllowed: true,

    /**
     * A function that performs no operations.
     */
    noop: function() {
    },

    /**
     * Returns a pre-instantiated object as a function.
     */
    valueFn: function(value) {
      return function valueRef() {
        return value;
      };
    },

    /**
     * Get the next unique id.
     * @returns {number} The next unqiue id.
     */
    nextID: function() {
      return uid++;
    },

    html5Check: function() {
      return $window.document.addEventListener;
    },

    isMobileDisplay: function() {
      return $($window).width() <= 650;
    },

    /**
     * Format a string.
     * @param {string} str - String to format.
     * @param {...*} args - Values to add to formatted string.
     * @returns {string} Formatted string.
     */
    formatString: function(str, args) {
      var a = arguments;
      return str.replace(/{(\d+)}/g, function(match, number) {
        return typeof a[+number + 1] !== 'undefined'
          ? a[+number + 1] : match;
      });
    },

    extend: function(me, withthis) {
      if (withthis && me)
        for (var i in withthis) {
          if (typeof withthis[i] === 'object') {
            $js.extend(me[i], withthis[i]);
          } else {
            me[i] = withthis[i];
          }
        }
      return me;
    },

    forEach: function(obj, iterator, context) {
      var key, length;
      if (obj) {
        if (Array.isArray(obj)) {
          var isPrimitive = typeof obj !== 'object';
          for (key = 0, length = obj.length; key < length; key++) {
            if (isPrimitive || key in obj) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else if (obj.forEach && obj.forEach !== $js.forEach) {
          obj.forEach(iterator, context, obj);
        } else if (typeof obj.hasOwnProperty === 'function') {
          for (key in obj)
            if (obj.hasOwnProperty(key))
              iterator.call(context, obj[key], key, obj);
        } else {
          for (key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
              iterator.call(context, obj[key], key, obj);
        }
      }
      return obj;
    },

    noThrow: function(func) {
      try {
        return func && func();
      } catch (e) { /* empty */ }
    },

    /**
     * Add an element (native)
     */
    addElement: function(type, attributes, parentElement) {

      var element = $window.document.createElement(type);

      if (attributes)
        for (var i in attributes)
          element.setAttribute(i, attributes[i]);

      parentElement.appendChild(element);
      return element;
    },

    ready: contentLoaded,

    handlers: {
      message: function(msg, callback, title) {

        // Show a simple alert.
        $window.alert(msg);
        if (callback)
          callback();
      },
      confirm: function(msg, callback, title, yescaption, nocaption) {

        // Show a simple confirmation.
        var ret = $window.confirm(msg);
        if (callback)
          callback(ret);
      },
      error: function(msg) {

        // Add error to body if it is loaded...
        if ($window.document.body) {
          $window.document.body.innerHTML = '<div style="padding: 30px; ' +
            'overflow-wrap: break-word;"><h1>Oops, we had an issue</h1>' + msg + '</div>';
        } else {
          $js.handlers.message(msg);
        }
      }
    },

    /**
     * Show an alert dialog.
     * @param {string} msg - Message to display.
     * @param {Function} [callbackFn] - Callback function to execute after the dialog is dismissed.
     * @param {string} [title="Application Message"] - Title of the dialog.
     */
    message: function(msg, callbackFn, title) {
      if (!$js.guiAllowed) {
        if (callbackFn)
          $code.setZeroTimeout(callbackFn);
        return;
      }
      title = title || 'Application Message';
      if ($js.handlers.message)
        return $js.handlers.message.apply(null, arguments);
    },

    /**
     * Show a confirmation dialog.
     * @param {string} msg - Message to display.
     * @param {Function} [callbackFn] - Callback function to execute after the dialog is dismissed.
     * @param {string} [title="Application Confirmation"] - Title of the dialog.
     * @param {string} [yescaption="OK"] - Caption of the "yes" button.
     * @param {string} [nocaption="Cancel"] - Caption of the "no" button.
     */
    confirm: function(msg, callbackFn, title, yescaption, nocaption) {
      if (!$js.guiAllowed) {
        if (callbackFn)
          $code.setZeroTimeout(callbackFn);
        return;
      }
      title = title || 'Application Confirmation';
      if ($js.handlers.confirm)
        return $js.handlers.confirm.apply(null, arguments);
    },

    /**
     * Display an error and kill the current execution.
     * @param {*} msg - Message to display.
     * @param {...*} [args] - Arguments to merge into message.
     */
    error: function(msg, args) {

      msg = msg.message || msg;

      // Merge string.
      if (typeof msg === 'string') {
        var arr = [msg];
        $js.forEach(arguments, function(a, i) {
          if (i > 0)
            arr.push(a);
        });
        msg = $js.formatString.apply(null, arr);
      }

      loaderHelper.hide();

      $log.error('Application Error: ' + msg);
      $event.fire('Error', msg);

      $code.onerror();

      // Run error handling.
      if (!$js.suppressNextError) {

        // Run the error handler.
        if ($js.handlers.error)
          $js.handlers.error(msg);

        // Kill execution.
        throw new Error('ERROR_HANDLED');
      }

      $js.suppressNextError = false;
    },

    mergeTemplate: function(template, obj) {
      template = template.replace(/{{(.*?)}}/g, function(match, prop) {
        return typeof obj[prop] !== 'undefined'
          ? obj[prop] : match;
      });
      return $(template);
    }

  };

})();

/**
 * A reference to the browsers window object. Allows us to mock the window during testing.
 */
var $window = $js.valueFn(window)();
