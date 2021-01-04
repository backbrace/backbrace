import { ShadowComponent } from './shadowcomponent';
import { fromError } from 'stacktrace-js';
import { get as getWindow } from '../providers/window';
import { settings } from '../settings';

/**
 * @class ErrorMessage
 * @augments ShadowComponent
 * @description
 * Error Component. Display an error message to the user.
 */
export class ErrorMessage extends ShadowComponent {

    /**
     * @constructs ErrorMessage
     */
    constructor() {

        super();

        /**
         * @description
         * System Error object.
         * @type {Error}
         */
        this.err = null;

        /**
         * @description
         * Source file cache.
         * @type {Object}
         */
        this.cache = {};

        this.update();
    }

    /**
     * Get a source line.
     * @param {string[]} lines Source lines.
     * @param {number} i Index of line to retrive (1 based).
     * @param {boolean} [sel] If `true` this line is selected.
     * @returns {string}
     */
    getLine(lines, i, sel) {
        let line = lines[i - 1];
        if (typeof line === 'undefined')
            return '';
        if (sel)
            return `>${i}| ${line}\r\n`;
        return `${i} | ${line}\r\n`;
    }

    /**
     * Get the source lines.
     * @param {string} path Path to the source file.
     * @param {number} line Line number to set as current.
     * @returns {AsyncGenerator}
     */
    async * getSource(path, line) {
        let file = this.cache[path];
        if (typeof file === 'undefined')
            return '';
        if (file instanceof Promise) {
            let f = await getWindow().fetch(path);
            if (f.ok) {
                file = await f.text();
                this.cache[path] = file;
            }
        }
        if (typeof file === 'string') {
            let lines = file.split('\n');
            yield this.getLine(lines, line - 5) +
                this.getLine(lines, line - 4) +
                this.getLine(lines, line - 3) +
                this.getLine(lines, line - 2) +
                this.getLine(lines, line - 1) +
                this.getLine(lines, line, true);
        }
    }

    /**
     * Render the error stack.
     * @returns {AsyncGenerator}
     */
    async * getStack() {

        let stack = await fromError(this.err, {
            sourceCache: this.cache
        });

        // Remove `generateError` frames.
        if (stack.length > 2 && stack[0].functionName === 'generateError')
            stack.splice(0, 2);

        // Remove mobx frames.
        stack = stack.filter(s => s.fileName.indexOf('node_modules/mobx') === -1);

        let html = stack.map((s) => {
            return this.html`<div style="margin: 30px 0 0 0;padding:0px;">
                <h4>${s.functionName}</h4>
                <small>${s.fileName}:${s.lineNumber}</small><br>
                <code><pre>${this.asyncReplace(this.getSource(s.fileName, s.lineNumber))}</pre></code>
                </div>`;
        });
        yield html;
    }

    /**
     * @override
     */
    render() {
        if (!this.err)
            return '';
        return this.html`
            <style>
                div{
                    padding: 30px;
                    overflow-wrap: break-word;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji,Segoe UI Emoji, Segoe UI Symbol;
                }
                h1{
                    font-size: 120%;
                    font-weight:bold;
                    margin:8px 0 8px 0;
                }
                h4{
                    margin: 2px;
                }
                pre{
                    padding: 10px;
                    background: #fcece8;
                    width: 100%;
                }
            </style>
            <div>
                <h1>Oops, we had an issue.</h1>
                ${this.err.message}
                ${settings.debug ? this.asyncReplace(this.getStack()) : ''}
            </div>
        `;
    }

}

ShadowComponent.define('bb-error', ErrorMessage);
