interface JSEvent {
    fire? (...args:any):void;
}

interface JSLog {
    debugMode? (flag:boolean):void;
}

interface JSUtil {    
    noThrow? (func:Function):void;
}

interface JSWindow {
    get? ():Window;
    set? (win:any):void;
}

interface JSScope {
    event:JSEvent;
    log:JSLog,
    util:JSUtil;
    window:JSWindow;
}

declare function jumpstart(fn:((scope:JSScope)=>void)):void;
