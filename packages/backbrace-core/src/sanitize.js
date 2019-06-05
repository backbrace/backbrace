/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Sanitize user input.
 * @module sanitize
 * @private
 */

import { get as getWindow } from './providers/window';

const tagWhitelist = {
    'A': true,
    'B': true,
    'BODY': true,
    'BR': true,
    'DIV': true,
    'EM': true,
    'HR': true,
    'I': true,
    'IMG': true,
    'P': true,
    'SPAN': true,
    'STRONG': true
},
    attributeWhitelist = {
        'href': true,
        'src': true
    };

/**
 * Decode HTML.
 * @method decode
 * @param {string} str HTML string to decode.
 * @returns {string} Returns the decoded string.
 */
export const decode = (function() {

    const window = getWindow(),
        element = window.document.createElement('textarea');

    /**
     * Decode html entity string.
     * @ignore
     * @param {string} str String to decode.
     * @returns {string} Decoded string.
     */
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

/**
 * Sanitize a HTML string.
 * @param {string} input String to sanitize.
 * @returns {string} Sanitized string.
 */
export function filter(input) {

    if (input === null || typeof input !== 'string') //Only sanitize strings.
        return input;

    //Decode loop.
    let oldinput = '';
    do {
        oldinput = input;
        input = decode(input);
    } while (oldinput !== input);

    let window = getWindow(),
        iframe = window.document.createElement('iframe');

    if (iframe['sandbox'] === undefined) {
        return '';
    }
    //@ts-ignore
    iframe['sandbox'] = 'allow-same-origin';
    iframe.style.display = 'none';
    window.document.body.appendChild(iframe); // necessary so the iframe contains a document
    iframe.contentDocument.body.innerHTML = input;

    /**
     * @ignore
     * @description
     * Make a safe copy of a node.
     * @param {*} node Node to copy.
     * @returns {HTMLElement} Copied node.
     */
    function makeSanitizedCopy(node) {
        let newNode = null;
        if (node.nodeType === 3) { // TEXT_NODE
            newNode = node.cloneNode(true);
        } else if (node.nodeType === 1 && tagWhitelist[node.tagName]) { // ELEMENT_NODE
            newNode = iframe.contentDocument.createElement(node.tagName);
            for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i];
                if (attributeWhitelist[attr.name]) {
                    newNode.setAttribute(attr.name, attr.value);
                }
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                let subCopy = makeSanitizedCopy(node.childNodes[i]);
                newNode.appendChild(subCopy, false);
            }
        } else {
            newNode = window.document.createDocumentFragment();
        }
        return newNode;
    }

    let resultElement = makeSanitizedCopy(iframe.contentDocument.body);
    window.document.body.removeChild(iframe);
    return resultElement.innerHTML;
}
