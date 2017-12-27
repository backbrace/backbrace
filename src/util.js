/**
 * Utility functions.
 * @module
 */
'use strict';

var uid = 1,
  timeouts = [],
  messageName = 'ztm';

/**
 * A function that performs no operations.
 */
function noop() {
}

/**
 * Get the next unique id.
 * @returns {number}
 */
function nextID() {
  return uid++;
}

/**
 * Check for HTML5 compatability.
 * @returns {boolean}
 */
function html5Check() {
  var $window = require('./Providers/window').get();
  return typeof $window.document.addEventListener !== 'undefined';
}

/**
 * Format a string.
 * @param {string} str - String to format.
 * @returns {string}
 */
function formatString(str) {
  var a = arguments;
  return str.replace(/{(\d+)}/g, function(match, number) {
    return typeof a[+number + 1] !== 'undefined'
      ? a[+number + 1] : match;
  });
}

/**
 * Extend an object with another object.
 * @param {*} me - Object to extend.
 * @param {*} withthis - Object to extend with.
 * @returns {*}
 */
function extend(me, withthis) {
  if (withthis && me)
    for (var i in withthis) {
      if (typeof withthis[i] === 'object') {
        extend(me[i], withthis[i]);
      } else {
        me[i] = withthis[i];
      }
    }
  return me;
}

/**
 * Iterate through an array or object.
 * @param {*} obj - Object to iterate through.
 * @param {function} iterator - Iterator function to call.
 * @param {*} [context] - Context to run the iterator function.
 * @returns {*}
 */
function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (Array.isArray(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
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
}

/**
 * Run a function and silence any errors.
 * @param {function} func - Function to run.
 */
function noThrow(func) {
  try {
    return func && func();
  } catch (e) { /* empty */ }
}

// Bind a message event listener to the window.
function bindMessageEvent() {
  var $window = require('./Providers/window').get();
  $window.addEventListener('message', function(event) {
    if (event.source === $window && event.data === messageName) {
      event.stopPropagation();
      if (timeouts.length)
        timeouts.shift()();
    }
  }, true);
}

function clearTimeouts() {
  timeouts = [];
}

/**
 * Run a function asyncroniously. Runs faster than setTimeout(fn, 0).
 * @param {Function} fn - Function to run after 0 seconds.
 */
function setZeroTimeout(fn) {
  var $window = require('./Providers/window').get();
  timeouts.push(fn);
  $window.postMessage(messageName, '*');
}

function parseDate(str) {
  var moment = require('../external/moment');
  if (str && str.indexOf('T') !== -1)
    return new Date(str);
  return moment(str, 'DD/MM/YYYY').toDate();
}

/**
 * Add an element (native).
 * @param {string} type - Element type to create.
 * @param {*} attributes - Attributes to add to the element.
 * @param {*} parentElement - Parent element to append to.
 * @returns {*}
 */
function addElement(type, attributes, parentElement) {

  var $window = require('./Providers/window').get(),
    element = $window.document.createElement(type);

  if (attributes)
    for (var i in attributes)
      element.setAttribute(i, attributes[i]);

  parentElement.appendChild(element);
  return element;
}

/**
 * Get the width of the window.
 */
function width() {
  var $window = require('./Providers/window').get();
  return $window.innerWidth || $window.document.documentElement.clientWidth ||
    $window.document.body.clientWidth;
}

// Bind the message event to the browser window.
bindMessageEvent();

module.exports = {
  noop: noop,
  nextID: nextID,
  html5Check: html5Check,
  formatString: formatString,
  extend: extend,
  forEach: forEach,
  noThrow: noThrow,
  clearTimeouts: clearTimeouts,
  setZeroTimeout: setZeroTimeout,
  addElement: addElement,
  width: width
};
