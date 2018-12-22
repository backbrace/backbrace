/**
 * Utility functions.
 * @module util
 * @private
 */

import { get as getJQuery } from './providers/jquery';
import { get as getWindow } from './providers/window';

let id = (new Date()).getTime(),
  timeouts = [],
  devMode = null;
const messageName = 'ztm',
  toString = Object.prototype.toString;

/**
 * A function that performs no operations.
 * @method noop
 * @memberof module:backbrace
 * @returns {void}
 * @example
 * var consoleFn = console.log || backbrace.noop;
 * consoleFn('Test message'); // Will not error if `console.log` is unavailable.
 */
export function noop() {
}

/**
 * Generate a unique id.
 * @method uid
 * @memberof module:backbrace
 * @returns {number} Returns a unique id.
 * @example
 * var id = backbrace.uid();
 */
export function uid() {
  return id++;
}

/**
 * Check for HTML5 compatability.
 * @method isHtml5
 * @memberof module:backbrace
 * @returns {boolean} `True` if the current environment is HTML5 compatable.
 */
export function isHtml5() {
  const window = getWindow();
  return typeof window.document.addEventListener !== 'undefined';
}

/**
 * Check if we are on a mobile/tablet device.
 * @method isMobileDevice
 * @memberof module:backbrace
 * @returns {boolean} `True` if we are using a mobile/tablet device.
 */
export function isMobileDevice() {
  const window = getWindow();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    .test(window.navigator.userAgent.toLowerCase());
}

/**
 * Determines if a reference is an `Error`.
 * @method isError
 * @memberof module:backbrace
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is an `Error`.
 */
export function isError(val) {
  const type = toString.call(val);
  switch (type) {
    case '[object Error]': return true;
    case '[object Exception]': return true;
    case '[object DOMException]': return true;
    default: return type instanceof Error;
  }
}

/**
 * Determines if a reference is defined.
 * @method isDefined
 * @memberof module:backbrace
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is defined.
 */
export function isDefined(val) {
  return typeof val !== 'undefined';
}

/**
 * Determines if a reference is a date.
 * @private
 * @param {*} val Reference to check.
 * @returns {boolean} Returns `true` if val is a date.
 */
export function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Format a string. Merge fields are specified by the argument number wrapped in {}.
 * @method formatString
 * @memberof module:backbrace
 * @param {string} str String to format.
 * @param {...*} args Arguments to merge into the string.
 * @returns {string} Formatted string.
 * @example
 * var str = backbrace.formatString('This is a {0} {1}.','test','message');
 * // str = 'This is a test message'
 */
export function formatString(str, ...args) {
  return str.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[+number] !== 'undefined'
      ? args[+number] : '';
  });
}

/**
 * Base extend.
 * @private
 * @param {*} dst Object to extend.
 * @param {any[]} objs Objects to extend with.
 * @param {boolean} [deep] Deep copy.
 * @returns {*} Extended object.
 */
function baseExtend(dst, objs, deep) {

  for (let i = 0, ii = objs.length; i < ii; ++i) {
    let obj = objs[i];
    if (typeof obj !== 'object' && typeof obj !== 'function') continue;
    let keys = Object.keys(obj);
    for (let j = 0, jj = keys.length; j < jj; j++) {
      let key = keys[j],
        src = obj[key];
      if (deep && typeof src === 'object') {
        if (isDate(src)) {
          dst[key] = new Date(src.valueOf());
        } else {
          if (typeof dst[key] !== 'object') dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        }
      } else {
        dst[key] = src;
      }
    }
  }
  return dst;
}

/**
 * Extend an object with another object.
 * @internal
 * @private
 * @param {*} dst Destination object.
 * @returns {*} Extended object.
 */
export function extend(dst) {
  return baseExtend(dst, [].slice.call(arguments, 1), false);
}

/**
 * Merge an object with another object.
 * @method merge
 * @memberof module:backbrace
 * @param {*} dst Destination object.
 * @param {...*} args Other objects to merge.
 * @returns {*} Extended object.
 */
export function merge(dst, ...args) {
  return baseExtend(dst, args, true);
}

/**
 * Iterate through an array or object.
 * @internal
 * @private
 * @template T
 * @param {ArrayLike<T>} obj Object to iterate through.
 * @param {function(T,Key,ArrayLike<T>):void} iterator Iterator function to call.
 * @param {*} [context] Context to run the iterator function.
 * @returns {ArrayLike<T>} Returned object for chaining.
 */
export function forEach(obj, iterator, context) {
  if (obj) {
    if (Array.isArray(obj)) {
      const isPrimitive = typeof obj !== 'object';
      for (let key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (Array.isArray(obj) && obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (typeof obj.hasOwnProperty === 'function') {
      for (let key in obj)
        if (obj.hasOwnProperty(key))
          iterator.call(context, obj[key], key, obj);
    } else {
      for (let key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key))
          iterator.call(context, obj[key], key, obj);
    }
  }
  return obj;
}

/**
 * Deep map.
 * @private
 * @param {*} obj Object.
 * @param {*} f Function.
 * @param {*} [ctx] Context.
 * @returns {*} Map.
 */
export function deepMap(obj, f, ctx) {
  if (Array.isArray(obj)) {
    return obj.map(function(val, key) {
      return (typeof val === 'object') ? deepMap(val, f, ctx) : f.call(ctx, val, key);
    });
  } else if (typeof obj === 'object') {
    let res = {},
      key;
    for (key in obj) {
      let val = obj[key];
      if (typeof val === 'object') {
        res[key] = deepMap(val, f, ctx);
      } else {
        res[key] = f.call(ctx, val, key);
      }
    }
    return res;
  } else {
    return obj;
  }
}

/**
 * Bind a message event listener to the window.
 * @private
 * @returns {void}
 */
export function bindMessageEvent() {
  const window = getWindow();
  window.addEventListener('message', function windowMessageEvent(event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation();
      if (timeouts.length)
        timeouts.shift()();
    }
  }, true);
}

/**
 * Clear all current message timeouts.
 * @internal
 * @private
 * @returns {void}
 */
export function clearTimeouts() {
  timeouts = [];
}

/**
 * Run a function asyncroniously. Runs faster than setTimeout(fn, 0).
 * @internal
 * @private
 * @param {Function} fn Function to run after 0 seconds.
 * @returns {void}
 */
export function setZeroTimeout(fn) {
  const window = getWindow();
  timeouts.push(fn);
  window.postMessage(messageName, '*');
}

/**
 * Add an element (native).
 * @internal
 * @private
 * @param {string} type Element type to create.
 * @param {*} attributes Attributes to add to the element.
 * @param {HTMLElement} parentElement Parent element to append to.
 * @returns {HTMLElement} Returns the new element created.
 */
export function addElement(type, attributes, parentElement) {

  const window = getWindow(),
    element = window.document.createElement(type);

  if (attributes)
    for (let i in attributes)
      element.setAttribute(i, attributes[i]);

  parentElement.appendChild(element);
  return element;
}

/**
 * Get the width of the window.
 * @private
 * @returns {number} Width of the window.
 */
export function width() {
  const window = getWindow();
  return window.innerWidth || window.document.documentElement.clientWidth ||
    window.document.body.clientWidth;
}

/**
 * Find the input editor.
 * @private
 * @param {JQuery} elem Element to search.
 * @returns {JQuery} Returns the editor if found.
 */
export function findInput(elem) {

  const $ = getJQuery();

  for (let i = 0; i < elem.children().length; i++) {
    if (elem.children()[i].nodeName === 'INPUT'
      || elem.children()[i].nodeName === 'TEXTAREA') {
      if (elem.children()[i].className !== 'noinput')
        return $(elem.children()[i]);
    }
    let v = findInput($(elem.children()[i]));
    if (v !== null)
      return v;
  }

  return null;
}

/**
 * Check if we are in dev mode.
 * @private
 * @returns {boolean} Returns `true` if we are in dev mode.
 */
export function isDevMode() {
  const window = getWindow();
  if (devMode === null) {
    // This takes advantage of the fact that `toString` is only called on logged objects if the console is open.
    let devtools = /./;
    devtools.toString = function() {
      devMode = true;
      return '';
    };
    window.console.log('%c', devtools);
    return devMode;
  }
  return devMode;
}

// Bind the message event to the browser window.
bindMessageEvent();
