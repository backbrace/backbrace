declare namespace Jumpstart {

    interface AlertProviderInstance {
        /** Display a message. */
        message(msg: string, callbackFn?: () => void, title?: string): void;
        /** Display a confirmation. */
        confirm(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        /** Display an error. */
        error(msg: (string)): void;
    }

    interface IconProviderInstance {
        /** Get an icon by name. */
        get(name: string, size?: number): string;
    }

    interface AppComponent {
        loadMenu?(): AppComponent;
        loadPage?(name: string): JQueryPromise;
    }

    interface PageComponent {
        action?(name: string): JQuery;
    }

    interface AppModule {
        component?(): AppComponent;
        confirm?(msg: string, callbackFn: (ret: boolean) => void, title?: string, yescaption?: string, nocaption?: string): void;
        error?(msg: (string | Error)): void;
        message?(msg: string, callbackFn?: () => void, title?: string): void;
        ready?(callback: Function): void;
    }

    interface ControllerModule {
        create?(name: string, definition: (ret: PageComponent) => void): void;
        get?(name: string): Function;
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

    interface Scope {
        app: AppModule;
        controller: ControllerModule;
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
declare function jumpstart(fn: ((scope: Jumpstart.Scope) => void)): void;