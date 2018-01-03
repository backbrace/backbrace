declare namespace Jumpstart {

    interface AlertInstance {
        message(msg:string, callbackFn?: () => void, title?: string): void;
        confirm(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        error(msg: (string|Error)): void;
    }

    interface AppModule {
        confirm?(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        error?(msg: (string|Error)): void;
        message?(msg: string, callbackFn?: () => void, title?: string): void;
        ready?(callback: Function): void;
    }

    interface EventModule {
        fire?(...args: any): void;
    }

    interface LogModule {
        debugMode?(flag: boolean): void;
        info?(msg: string): void;
        error?(msg: string): void;
        warning?(msg: string): void;
        debug?(msg: string): void;
        object?(msg: Object): void;
    }

    interface UtilModule {
        isDefined?(val: any): boolean;
        isError?(val: any): boolean;
        isString?(val: any): boolean;        
        noop?(): void;
        toString?(val: any): string;
    }

    interface WindowModule {
        get?(): Window;
        set?(win: (Window | Object)): void;
    }

    interface ScopeModule {
        app: AppModule;
        event: EventModule;
        log: LogModule;
        util: UtilModule;
        window: WindowModule;
    }
}

/**
 * Jumpstart global function. Used externally to access Jumpstart modules, etc.
 * @param fn Callback function that will be passed the Jumpstart scope.
 */
declare function jumpstart(fn: ((scope: Jumpstart.ScopeModule) => void)): void;