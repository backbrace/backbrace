interface JQueryRippleSettings {
    color?: string;
}

interface JQueryRipple{
    (settings?: JQueryRippleSettings):JQuery;
}

interface JQueryStatic {
    ripple: JQueryRipple;
}

interface JQuery {
    ripple: JQueryRipple;
}
