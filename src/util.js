/**
 * Utility functions.
 * @module util
 * @private
 */
'use strict';

var windowprovider = require('./providers/window'),
  uid = 1,
  timeouts = [],
  messageName = 'ztm',
  toString = Object.prototype.toString;

/**
 * A function that performs no operations.
 * @returns {void}
 */
function noop() {
}

/**
 * Get the next unique id.
 * @method id
 * @memberof module:js
 * @returns {number} Returns a unique ID.
 */
function nextID() {
  return uid++;
}

/**
 * Check for HTML5 compatability.
 * @returns {boolean} `True` if the current environment is HTML5 compatable.
 */
function html5Check() {
  var window = windowprovider.get();
  return typeof window.document.addEventListener !== 'undefined';
}

/**
 * Check if we are on a mobile/tablet device.
 * @returns {boolean} `True` if we are using a mobile/tablet device.
 */
function mobileCheck() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    .test(window.navigator.userAgent.toLowerCase());
}

/**
 * Determines if a reference is a `string`.
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is a `string`.
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determines if a reference is an `Error`.
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is an `Error`.
 */
function isError(val) {
  var type = toString.call(val);
  switch (type) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return type instanceof Error;
  }
}

/**
 * Determines if a reference is defined.
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is defined.
 */
function isDefined(val) {
  return typeof val !== 'undefined';
}

/**
 * Format a string.
 * @param {string} str String to format.
 * @returns {string} Formatted string.
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
 * @param {Object} me Object to extend.
 * @param {Object} withthis Object to extend with.
 * @returns {Object} Extended object.
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
 * @param {Array|Object} obj Object to iterate through.
 * @param {Function} iterator Iterator function to call.
 * @param {Object} [context] Context to run the iterator function.
 * @returns {Array|Object} Returned object for chaining.
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
 * Bind a message event listener to the window.
 * @returns {void}
 */
function bindMessageEvent() {
  var window = windowprovider.get();
  window.addEventListener('message', function(event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation();
      if (timeouts.length)
        timeouts.shift()();
    }
  }, true);
}

/**
 * Clear all current message timeouts.
 * @returns {void}
 */
function clearTimeouts() {
  timeouts = [];
}

/**
 * Run a function asyncroniously. Runs faster than setTimeout(fn, 0).
 * @param {Function} fn Function to run after 0 seconds.
 * @returns {void}
 */
function setZeroTimeout(fn) {
  var window = windowprovider.get();
  timeouts.push(fn);
  window.postMessage(messageName, '*');
}

function parseDate(str) {
  var moment = require('../external/moment');
  if (str && str.indexOf('T') !== -1)
    return new Date(str);
  return moment(str, 'DD/MM/YYYY').toDate();
}

/**
 * Add an element (native).
 * @param {string} type Element type to create.
 * @param {Object} attributes Attributes to add to the element.
 * @param {HTMLElement} parentElement Parent element to append to.
 * @returns {HTMLElement} Returns the new element created.
 */
function addElement(type, attributes, parentElement) {

  var window = windowprovider.get(),
    element = window.document.createElement(type);

  if (attributes)
    for (var i in attributes)
      element.setAttribute(i, attributes[i]);

  parentElement.appendChild(element);
  return element;
}

/**
 * Get the width of the window.
 * @returns {number} Width of the window.
 */
function width() {
  var window = windowprovider.get();
  return window.innerWidth || window.document.documentElement.clientWidth ||
    window.document.body.clientWidth;
}

/**
 * Decode HTML.
 * @param {string} str HTML string to decode.
 * @returns {string} Returns the decoded string.
 */
var decodeHTML = (function() {

  var window = windowprovider.get(),
    element = window.document.createElement('textarea');

  function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
      str = str.replace(/</g, '&lt;');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

function sanitizeString(input) {

  if (input === null || typeof input !== 'string') //Only sanitize strings.
    return input;

  //Decode loop.
  var oldinput = '';
  do {
    oldinput = input;
    input = decodeHTML(input);
  } while (oldinput !== input);

  return input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
    replace(/<[/!]*?[^<>]*?>/gi, '').
    replace(/<style[^>]*?>.*?<\/style>/gi, '').
    replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
}

/**
 * Find the input editor.
 * @param {JQuery} elem Element to search.
 * @returns {JQuery} Returns the editor if found.
 */
function findInput(elem) {

  var $ = require('../external/jquery');

  for (var i = 0; i < elem.children().length; i++) {
    if (elem.children()[i].nodeName === 'INPUT'
      || elem.children()[i].nodeName === 'TEXTAREA') {
      if (elem.children()[i].className !== 'noinput')
        return $(elem.children()[i]);
    }
    var v = findInput($(elem.children()[i]));
    if (v !== null)
      return v;
  }

  return null;
}

// Bind the message event to the browser window.
bindMessageEvent();

module.exports = {
  noop: noop,
  nextID: nextID,
  html5Check: html5Check,
  mobileCheck: mobileCheck,
  toString: toString,
  isString: isString,
  isError: isError,
  isDefined: isDefined,
  formatString: formatString,
  extend: extend,
  forEach: forEach,
  clearTimeouts: clearTimeouts,
  setZeroTimeout: setZeroTimeout,
  addElement: addElement,
  width: width,
  decodeHTML: decodeHTML,
  sanitizeString: sanitizeString,
  findInput: findInput
};
