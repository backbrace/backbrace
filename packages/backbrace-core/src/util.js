/**
 * Utility functions.
 * @module util
 * @private
 */

import $ from 'jquery';
import Clipboard from 'clipboard';
import { get as getWindow } from './providers/window';

let id = (new Date()).getTime();
const toString = Object.prototype.toString;

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
 * Highlight the syntax of a pre code element.
 * @param {HTMLElement} elem Element to highlight.
 * @returns {void}
 */
export function highlightSyntax(elem) {
  import('highlight.js').then((hljs) => hljs.highlightBlock(elem));
}

/**
 * Add clipboard event to an element.
 * @param {HTMLElement} trigger Element to trigger the clipboard event.
 * @param {string} text Text to copy.
 * @param {*} success Function to run on success.
 * @returns {ClipboardJS} Returns a clipboard js object.
 */
export function clipboard(trigger, text, success) {
  var clipboard = new Clipboard(trigger, {
    text: function() {
      return text;
    }
  });
  clipboard.on('success', success);
  return clipboard;
}
