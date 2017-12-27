interface JSApp {
    confirm?(msg:string,callback:(ret:boolean) => void,title?:string,yescaption?:string,nocaption?:string):void;
    ready?(callback:Function):void;
}

interface JSEvent {
    fire?(...args:any):void;
}

interface JSLog {
    debugMode?(flag:boolean):void;
    info?(msg:string):void,
    error?(msg:string):void,
    warning?(msg:string):void,
    debug?(msg:string):void,
    object?(msg:Object):void
}

interface JSUtil {    
    noThrow? (func:Function):void;
}

interface JSWindow {
    get? ():Window;
    set? (win:(Window|Object)):void;
}

interface JSScope {
    app:JSApp,
    event:JSEvent;
    log:JSLog,
    util:JSUtil;
    window:JSWindow;
}

declare function jumpstart(fn:((scope:JSScope)=>void)):void;
