declare namespace Jumpstart {

    interface App {
        confirm?(msg: string, callback: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
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
        noThrow?(func: Function): void;
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
