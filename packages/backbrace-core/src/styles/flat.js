/**
 * Flat style.
 * @module flatstyle
 * @private
 */

import { globals } from '../globals';
import { style as base } from './base';
import { merge } from '../util';

/**
 * Flat style jss object.
 */
export let style = merge({}, base, {

  'body': {
    margin: '0px',
    'font-family': '%font:family%',
    'font-size': '14px',
    'color': 'rgba(0, 0, 0, 0.87)',
    background: '%colors:background%',
    '@media only screen and (max-width: %screen:mediumUp%px)': {
      margin: '0',
      'overflow-x': 'visible',
      'overflow-y': 'hidden',
      '-webkit-text-size-adjust': '100%',
      '-ms-text-size-adjust': 'none',
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
    },
    '@media only screen and (min-width: %screen:medium%px)': {
      'font-size': '14.5px'
    },
    '@media only screen and (min-width: %screen:large%px)': {
      'font-size': '14.5px'
    }
  },
  'h1, h2, h3, h4, h5, h6': {
    'font-weight': '400',
    'line-height': '1.1'
  },
  'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a': {
    'font-weight': 'inherit'
  },
  'h1': {
    'font-size': '4.2em',
    'line-height': '110%',
    'margin': '2.1em 0 1.68em 0'
  },
  'h2': {
    'font-size': '3.56em',
    'line-height': '110%',
    'margin': '1.78em 0 1.424em 0'
  },
  'h3': {
    'font-size': '2.92em',
    'line-height': '110%',
    'margin': '1.46em 0 1.168em 0'
  },
  'h4': {
    'font-size': '2.28em',
    'line-height': '110%',
    'margin': '1.14em 0 0.912em 0'
  },
  'h5': {
    'font-size': '1.2em',
    'line-height': '110%',
    'margin': '0.82em 0 0.656em 0'
  },
  'h6': {
    'font-size': '1em',
    'line-height': '110%',
    'margin': '0.5em 0 0.4em 0'
  },
  '.z-depth-1': {
    '-webkit-box-shadow': '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)',
    'box-shadow': '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)'
  },
  '.header': {
    display: 'block'
  },
  '.navbar': {
    color: '%colors:primarytext%',
    top: '0px',
    left: '0px',
    right: '0px',
    'z-index': '3000'
  },
  '.navbar-inner': {
    'background': '%colors:primary%',
    height: '50px',
    'padding-left': '0px',
    'padding-right': '0px'
  },
  '.navbar-brand': {
    float: 'left',
    'font-size': '1.2em',
    'font-weight': 'normal',
    'line-height': '32px',
    margin: '8px 80px 0 8px'
  },
  '.navbar-logo': {
    'max-height': '35px'
  },
  '.mobile-app .navbar-logo': {
    'margin-top': '7px'
  },
  '.profile-img': {
    display: 'none',
    margin: '5px',
    float: 'right',
    width: '40px',
    height: '40px'
  },
  '.menu-icon': {
    display: 'inline-block',
    cursor: 'pointer',
    float: 'left',
    width: '50px',
    height: '50px',
    'font-size': '35px',
    'max-height': '50px',
    'box-sizing': 'border-box',
    'text-align': 'center',
    padding: '8px'
  },
  '.menu': {
    display: 'none',
    position: 'fixed',
    top: '0px',
    left: '-300px',
    width: '300px',
    height: '100vh',
    background: '#FFF',
    'z-index': '30001'
  },
  '.menu-brand': {
    'width': '100%',
    'align-items': 'center',
    'text-align': 'center',
    'margin-top': '20px'
  },
  '.menu-logo': {
    'max-height': '40px'
  },
  '.circle-img': {
    'background-size': 'cover',
    'background-position': 'center center',
    'border-radius': '50%',
    '-moz-border-radius': '50%',
    '-webkit-border-radius': '50%',
    'border-spacing': '0px'
  },
  '.main': {
    'margin-top': '50px',
    'padding-top': '5px'
  },
  '.main-windows': {
    width: '100%',
    background: '%colors:surface%',
    display: 'inline-block',
    'padding-left': '3px',
    'border-bottom': '1px solid #ecf0f1',
    'box-sizing': 'border-box'
  },
  '.viewer-full': {
    'left': '100vw',
    'top': '0px',
    'position': 'absolute',
    'width': '100vw',
    'height': '100vh',
    background: '%colors:surface%'
  },
  '.mobile-app .viewer': {
    'height': 'calc(100vh - 110px)',
    'overflow-y': 'auto'
  },
  '.window': {
    'box-sizing': 'border-box',
    position: 'relative',
    padding: '8px !important',
    'border-radius': '3px',
    '@media only screen and (min-width: %screen:smallUp%px)': {
      'margin-top': '20px',
      padding: '24px !important',
      background: '%colors:surface%',
      'min-height': '200px'
    }
  },
  '.preloader': {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    'z-index': '30001',
    background: '%colors:surface%',
    'background-image': `url(${globals.CDNSERVER}/images/placeholder.gif)`,
    'background-repeat': 'no-repeat',
    'background-position': '40px 40px'
  },
  '.title-bar': {
    padding: '0 10px',
    position: 'relative'
  },
  '.title': {
    display: 'inline-block'
  },
  '.title-icon': {
    float: 'right',
    padding: '5px',
    'font-size': '1.2em',
    cursor: 'pointer',
    opacity: '.6'
  },
  '.title-icon:hover': {
    opacity: '.8'
  },
  '.main-windows-btn': {
    padding: '15px 5px 15px 5px',
    'font-size': '1em',
    width: 'auto',
    display: 'inline-block',
    'margin-right': '3px',
    cursor: 'pointer'
  },
  '.main-windows-btn.active': {
    'border-bottom': '2px solid %colors:primary%',
    color: '%colors:primary%'
  },
  '.mobile-app .actions-bar': {
    position: 'fixed',
    bottom: '0px',
    'background-color': '%colors:secondary%',
    left: '0px !important',
    width: '100vw',
    'box-sizing': 'border-box',
    height: 'auto',
    'z-index': '29001'
  },
  '.action-button': {
    display: 'inline-block',
    'font-size': '.9em',
    padding: '.5em',
    margin: '.2em',
    cursor: 'pointer',
    'text-transform': 'uppercase',
    'border-radius': '3px',
    background: '%colors:secondary%',
    color: '%colors:secondarytext%'
  },
  '.desktop-app .action-button': {
    'font-weight': '400'
  },
  '.mobile-app .action-button': {
    padding: '.7em .8em',
    'font-size': '.9em',
    margin: '0',
    'text-align': 'center',
    width: '25vw',
    'box-sizing': 'border-box',
    'line-height': '1.7em',
    'border-width': '0px',
    height: '60px'
  },
  '.action-button:hover': {
    background: '%colors:secondaryvar%',
    color: '%colors:secondaryvartext%'
  },
  '.mobile-app .action-icon': {
    'display': 'block',
    'font-size': '1.2em'
  },
  '.window-height-auto': {
    height: 'auto'
  },
  '.window-height-full': {
    'min-height': '300px',
    'height': '100%'
  },
  '.window-height-block': {
    'max-height': '300px',
    height: '300px'
  },
  '.window-height-half': {
    'min-height': '200px',
    'height': '50%'
  },
  '.main-container': {
    width: '100%',
    display: 'inline-block',
    'vertical-align': 'top'
  },
  '.mobile-app .main-container': {
    height: '100vh',
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: '100vw'
  },
  '.main-container.pad': {
    'margin-top': '50px'
  },
  '.side-container': {
    display: 'none',
    width: '30%',
    'vertical-align': 'top'
  },
  '.control-container': {
    width: '100%',
    'font-size': '1em'
  },
  '.control-label': {
    display: 'block',
    opacity: '.6',
    'font-weight': '400',
    'margin-top': '1.1em',
    'font-size': '.9em'
  },
  '.control-input': {
    '-webkit-box-sizing': 'border-box',
    'box-sizing': 'border-box',
    display: 'block',
    'background-color': 'transparent',
    opacity: '.8',
    border: 'none',
    'border-bottom': '1px solid rgba(0, 0, 0, 0.26)',
    outline: 'none',
    width: '100%',
    height: '3em',
    padding: '0',
    'font-size': '.9em',
    'line-height': 'inherit',
    margin: '0 0 8px 0'
  },
  '.control-input:focus': {
    'border-color': '%colors:primary%',
    'border-width': '2px'
  },
  '.list-component .control-input': {
    'height': '2em'
  },
  '.grid-container': {
    'width': '100%',
    overflow: 'auto',
    'border-top': '1px solid #CCC'
  },
  '.row-id': {
    'font-size': '0px !important'
  },
  '.overlay': {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: '0.6',
    background: '%colors:surface%',
    'z-index': '30000'
  },
  '.progress': {
    position: 'relative',
    height: '4px',
    display: 'block',
    width: '100%',
    'background-color': '%loader:progressbackground%',
    'border-radius': '2px',
    margin: '.5rem 0 1rem 0',
    overflow: 'hidden'
  },
  '.progress .determinate': {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    'background-color': '%loader:progresscolor%',
    '-webkit-transition': 'width .3s linear',
    transition: 'width .3s linear'
  },
  '.progress .indeterminate': {
    'background-color': '%loader:progresscolor%'
  },
  '.progress .indeterminate:before': {
    content: '\'\'',
    position: 'absolute',
    'background-color': 'inherit',
    top: '0',
    left: '0',
    bottom: '0',
    'will-change': 'left, right',
    '-webkit-animation': 'indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
    animation: 'indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite'
  },
  '.progress .indeterminate:after': {
    content: '\'\'',
    position: 'absolute',
    'background-color': 'inherit',
    top: '0',
    left: '0',
    bottom: '0',
    'will-change': 'left, right',
    '-webkit-animation': 'indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
    animation: 'indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
    '-webkit-animation-delay': '1.15s',
    'animation-delay': '1.15s'
  },
  '.ace_editor': {
    border: '1px solid lightgray',
    margin: 'auto',
    height: '200px',
    width: '100%'
  },
  '@-webkit-keyframes indeterminate': {
    '0%': {
      left: '-35%',
      right: '100%'
    },
    '60%': {
      left: '100%',
      right: '-90%'
    },
    '100%': {
      left: '100%',
      right: '-90%'
    }
  },
  '@keyframes indeterminate': {
    '0%': {
      left: '-35%',
      right: '100%'
    },
    '60%': {
      left: '100%',
      right: '-90%'
    },
    '100%': {
      left: '100%',
      right: '-90%'
    }
  },
  '@-webkit-keyframes indeterminate-short': {
    '0%': {
      left: '-200%',
      right: '100%'
    },
    '60%': {
      left: '107%',
      right: '-8%'
    },
    '100%': {
      left: '107%',
      right: '-8%'
    }
  },
  '@keyframes indeterminate-short': {
    '0%': {
      left: '-200%',
      right: '100%'
    },
    '60%': {
      left: '107%',
      right: '-8%'
    },
    '100%': {
      left: '107%',
      right: '-8%'
    }
  },
  /* JQuery UI Overrides */
  '.ui-widget': {
    'font-family': '%font:family%',
    'font-size': '.8em',
    'font-weight': '400'
  },
  '.ui-widget.ui-widget-content': {
    border: '0'
  },
  '.ui-widget-content': {
    border: '0'
  },
  '.ui-state-highlight': {
    background: '%colors:hover% !important',
    color: '%colors:hovertext% !important'
  },
  /* Sweet Alert Overrides */
  '.sweet-alert': {
    'font-family': 'inherit !important'
  },
  '.sweet-alert button': {
    'background-color': '%colors:secondary% !important',
    color: '%colors:secondarytext% !important'
  },
  '.sweet-alert button:hover': {
    'background-color': '%colors:secondaryvar% !important',
    color: '%colors:secondaryvartext% !important'
  },
  /* JQGrid Overrides */
  '.ui-jqgrid': {
    border: '0'
  },
  '.ui-jqgrid tr.jqgrow td': {
    'vertical-align': 'middle',
    'font-size': '1.2em',
    'padding': '.4em !important'
  },
  '.ui-jqgrid .ui-jqgrid-htable th div': {
    'font-size': '1.3em',
    'font-weight': 'bold',
    opacity: '.6',
    'padding': '.2em',
    'height': '1.6em !important',
    'text-align': 'left',
    'box-sizing': 'border-box'
  },
  '.ui-jqgrid .ui-jqgrid-htable th.ui-th-column, .ui-th-column': {
    background: '%colors:surface%'
  },
  '.ui-jqgrid-hdiv': {
    background: '%colors:surface% !important'
  },
  '.ui-jqgrid tr.ui-row-ltr td': {
    'border-right-color': '#CCC !important'
  },
  '.ui-jqgrid tr.jqfoot td,.ui-jqgrid tr.jqgroup td,.ui-jqgrid tr.jqgrow td': {
    'border-bottom-color': '#CCC !important'
  }
});
