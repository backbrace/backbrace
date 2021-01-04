import { get as getWindow } from './providers/window';

/**
 * @description
 * Utility functions.
 * @module util
 * @private
 */

/** @ignore */
let id = (new Date()).getTime();

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
 * var id = Backbrace.uid();
 */
export function uid() {
  return id++;
}

/**
 * Check for browser compatability.
 * @returns {boolean} `True` if the current environment is compatable.
 */
export function checkBrowser() {

  const window = getWindow();

  // Check HTML5.
  if (typeof window.document.addEventListener === 'undefined')
    return false;

  //Check Dynamic Imports.
  try {
    // eslint-disable-next-line no-new,no-new-func
    new Function('import("")');
  } catch (err) {
    return false;
  }
  return true;
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
 * Format a string. Merge fields are specified by the argument number wrapped in {}.
 * @param {string} str String to format.
 * @param {...unknown} args Arguments to merge into the string.
 * @returns {string} Formatted string.
 * @example
 * var str = Backbrace.formatString('This is a {0} {1}.','test','message');
 * // str = 'This is a test message'
 */
export function formatString(str, ...args) {
  return str.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[+number] !== 'undefined'
      ? args[+number].toString() : '';
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
 * Add clipboard event to an element.
 * @param {HTMLElement} trigger Element to trigger the clipboard event.
 * @param {string} text Text to copy.
 * @param {import('./types').clipboardSuccess} success Function to run on success.
 * @returns {void}
 */
export function clipboard(trigger, text, success) {

  let Clipboard = require('clipboard');

  new Clipboard(trigger, {
    text: function() {
      return text;
    }
  }).on('success', success);
}

/**
 * Make a function chainable.
 * @param {Function} fn Function to chain.
 * @returns {Function}
 */
export function makeChainable(fn) {
  let p = Promise.resolve(true);
  return (...args) => {
    p = p.then(() => fn(...args));
    return p;
  };
}

/**
 * Make a function chainable.
 * @param {Function} generator Function to make single.
 * @returns {Function}
 */
export function makeSingle(generator) {
  let globalNonce;
  return async function(...args) {
    const localNonce = globalNonce = new Object();
    const iter = generator(...args);
    let resumeValue;
    for (; ;) {
      const n = iter.next(resumeValue);
      if (n.done) {
        return n.value;  // final return value of passed generator
      }
      // whatever the generator yielded, _now_ run await on it
      resumeValue = await n.value;
      if (localNonce !== globalNonce) {
        return;  // a new call was made
      }
      // next loop, we give resumeValue back to the generator
    }
  };
}
