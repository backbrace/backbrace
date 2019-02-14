/**
 * Base style.
 * @module basestyle
 * @private
 */

const maxColumns = 12;

/**
 * Base style jss object.
 */
export let style = {
    '.unselectable': {
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    },
    '.cuttext': {
        'white-space': 'nowrap',
        'overflow-x': 'hidden',
        'overflow-y': 'hidden',
        'text-overflow': 'ellipsis'
    },
    '.fixed': {
        position: 'fixed'
    },
    '.no-border': {
        'border': '0px !important'
    },
    '.no-padding': {
        'padding': '0px !important'
    },
    '.no-margin': {
        'margin': '0px !important'
    },
    '.container': {
        'margin': '0 auto',
        'max-width': '1280px',
        'width': '100%',
        '@media only screen and (min-width: %screen:smallUp%px)': {
            'width': '85%'
        },
        '@media only screen and (min-width: %screen:mediumUp%px)': {
            'width': '70%'
        }
    },
    '.col .row': {
        'margin-left': '-.75rem',
        'margin-right': '-.75rem'
    },
    '.row': {
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-bottom': '20px'
    },
    '.row:after': {
        'content': '""',
        'display': 'table',
        'clear': 'both'
    },
    '.row .col': {
        'float': 'left',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        'padding': '0 .75rem',
        'min-height': '1px'
    },
    '.hide-on-small-only, .hide-on-small-and-down': {
        '@media only screen and (max-width: %screen:small%px)': {
            'display': 'none !important'
        }
    },
    '.show-on-small': {
        '@media only screen and (max-width: %screen:small%px)': {
            'display': 'block !important'
        }
    },
    '.hide-on-med-and-down': {
        '@media only screen and (max-width: %screen:large%px)': {
            'display': 'none !important'
        }
    },
    '.show-on-medium-and-down': {
        '@media only screen and (max-width: %screen:medium%px)': {
            'display': 'block !important'
        }
    },
    '.hide-on-med-and-up': {
        '@media only screen and (min-width: %screen:smallUp%px)': {
            'display': 'none !important'
        }
    },
    '.show-on-medium-and-up': {
        '@media only screen and (min-width: %screen:smallUp%px)': {
            'display': 'block !important'
        }
    },

    '.hide-on-med-only': {
        '@media only screen and (min-width: 600px) and (max-width: %screen:medium%px)': {
            'display': 'none !important'
        }
    },
    '.show-on-medium': {
        '@media only screen and (min-width: 600px) and (max-width: %screen:medium%px)': {
            'display': 'block !important'
        }
    },
    '.hide-on-large-only': {
        '@media only screen and (min-width: %screen:largeUp%px)': {
            'display': 'none !important'
        }
    },
    '.show-on-large': {
        '@media only screen and (min-width: %screen:largeUp%px)': {
            'display': 'block !important'
        }
    },
    '.grid-fluid': {
        display: ['-ms-flexbox', '-webkit-flex', 'flex'],
        'justify-content': 'center',
        'text-align': 'left',
        margin: '0 0 40px',
        '@media (max-width: 480px)': {
            'flex-direction': 'column'
        }
    }
};

/**
 * Generate grid column styles.
 * @param {*} style JSS style to modify.
 * @returns {void}
 */
function gridColumns(style) {
    for (let i = 1; i <= maxColumns; i++)
        style['.row .col.s' + i] = {
            'width': (100 / maxColumns * i) + '%',
            'margin-left': 'auto',
            'left': 'auto',
            'right': 'auto'
        };
    for (let i = 1; i <= maxColumns; i++)
        style['.row .col.m' + i] = {
            '@media only screen and (min-width: %screen:smallUp%px)': {
                'width': (100 / maxColumns * i) + '%',
                'margin-left': 'auto',
                'left': 'auto',
                'right': 'auto'
            }
        };
    for (let i = 1; i <= maxColumns; i++)
        style['.row .col.l' + i] = {
            '@media only screen and (min-width: %screen:mediumUp%px)': {
                'width': (100 / maxColumns * i) + '%',
                'margin-left': 'auto',
                'left': 'auto',
                'right': 'auto'
            }
        };
    for (let i = 1; i <= maxColumns; i++)
        style['.row .col.xl' + i] = {
            '@media only screen and (min-width: %screen:largeUp%px)': {
                'width': (100 / maxColumns * i) + '%',
                'margin-left': 'auto',
                'left': 'auto',
                'right': 'auto'
            }
        };
}

gridColumns(style);
