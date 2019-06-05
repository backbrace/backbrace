/**
 * Utility functions.
 * @module util
 * @private
 */

import $ from 'jquery';
import { get as getWindow } from './providers/window';

let id = (new Date()).getTime(),
  timeouts = [],
  devMode = null;
const messageName = 'ztm',
  toString = Object.prototype.toString;

/**
 * A function that performs no operations.
 * @returns {void}
 * @example
 * var consoleFn = console.log || backbrace.noop;
 * consoleFn('Test message'); // Will not error if `console.log` is unavailable.
 */
export function noop() {
}

/**
 * Generate a unique id.
 * @returns {number} Returns a unique id.
 * @example
 * var id = backbrace.uid();
 */
export function uid() {
  return id++;
}

/**
 * Check for HTML5 compatability.
 * @returns {boolean} `True` if the current environment is HTML5 compatable.
 */
export function isHtml5() {
  const window = getWindow();
  return typeof window.document.addEventListener !== 'undefined';
}

/**
 * Check if we are on a mobile/tablet device.
 * @returns {boolean} `True` if we are using a mobile/tablet device.
 */
export function isMobileDevice() {
  const window = getWindow();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
    .test(window.navigator.userAgent.toLowerCase());
}

/**
 * Determines if a reference is an `Error`.
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
 * @param {*} val Reference to check.
 * @returns {boolean} `True` if val is defined.
 */
export function isDefined(val) {
  return typeof val !== 'undefined';
}

/**
 * Determines if a reference is a date.
 * @param {*} val Reference to check.
 * @returns {boolean} Returns `true` if val is a date.
 */
export function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Format a string. Merge fields are specified by the argument number wrapped in {}.
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
 * Bind a message event listener to the window.
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
 * @returns {void}
 */
export function clearTimeouts() {
  timeouts = [];
}

/**
 * Run a function asyncroniously. Runs faster than setTimeout(fn, 0).
 * @internal
 * @param {Function} fn Function to run after 0 seconds.
 * @returns {void}
 */
export function setZeroTimeout(fn) {
  const window = getWindow();
  timeouts.push(fn);
  window.postMessage(messageName, '*');
}

/**
 * Get the width of the window.
 * @returns {number} Width of the window.
 */
export function width() {
  const window = getWindow();
  return window.innerWidth || window.document.documentElement.clientWidth ||
    window.document.body.clientWidth;
}

/**
 * Find the input editor.
 * @param {JQuery} elem Element to search.
 * @returns {JQuery} Returns the editor if found.
 */
export function findInput(elem) {

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
