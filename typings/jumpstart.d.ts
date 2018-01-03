declare namespace Jumpstart {

    interface AlertInstance {
        message(msg:string, callbackFn?: () => void, title?: string): void;
        confirm(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        error(msg: (string|Error|Exception|DOMException)): void;
    }

    interface App {
        confirm?(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        error?(msg: (string|Error|Exception|DOMException)): void;
        message?(msg: string, callbackFn?: () => void, title?: string): void;
        ready?(callback: Function): void;
    }

    interface Event {
        fire?(...args: any): void;
    }

    interface Log {
        debugMode?(flag: boolean): void;
        info?(msg: string): void;
        error?(msg: string): void;
        warning?(msg: string): void;
        debug?(msg: string): void;
        object?(msg: Object): void;
    }

    interface Util {
        isString?(val: any): boolean;
    }

    interface Window {
        get?(): Window;
        set?(win: (Window | Object)): void;
    }

    interface Scope {
        app: App;
        event: Event;
        log: Log;
        util: Util;
        window: Window;
    }
}

/**
 * Jumpstart global function. Used externally to access Jumpstart modules, etc.
 * @param fn Callback function that will be passed the Jumpstart scope.
 */
declare function jumpstart(fn: ((scope: Jumpstart.Scope) => void)): void;
