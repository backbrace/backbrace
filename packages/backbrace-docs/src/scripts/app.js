'use strict';

(function(window, $) {

    var base = backbrace.style('base');
    backbrace.setStyle($.extend({}, base, {
        'body': {
            'overflow-y': 'auto !important',
            'font-family': '%font:family%',
            'font-size': '14px'
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
            height: '64px',
            'padding-left': '0px',
            'padding-right': '0px'
        },
        '.navbar-brand': {
            float: 'left',
            margin: '12px 80px 0 20px'
        },
        '.navbar-logo': {
            'max-height': '40px'
        },
        '.mobile-app .navbar-logo': {
            'margin-top': '7px'
        },
        '.menu-icon': {
            display: 'inline-block',
            cursor: 'pointer',
            float: 'left',
            width: '64px',
            height: '64px',
            'font-size': '35px',
            'max-height': '64px',
            'box-sizing': 'border-box',
            'text-align': 'center',
            padding: '12px'
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
        '.main': {
            'margin-top': '64px',
            'padding-top': '5px'
        },
        '.viewer': {
            'margin-top': '20px'
        },
        'p': {
            'font-size': '1.1em',
            'line-height': '1.4em',
            'letter-spacing': '.3px'
        },
        'h1': {
            'font-size': '2em',
            'line-height': '110%',
            margin: '8px 0'
        },
        'h4': {
            'font-size': '1.5em',
            'margin-top': '20px'
        },
        'h5': {
            margin: '0',
            'font-size': '1.1em'
        },
        'footer': {
            position: 'absolute',
            'line-height': '24px',
            flex: '1',
            padding: '48px',
            'z-index': '0',
            'background-color': '#3498db',
            color: '#fafafa',
            'font-weight': '300',
            margin: '20px 0 24px 0',
            left: '0px',
            width: '100%',
            'box-sizing': 'border-box'
        },
        'footer p': {
            'text-align': 'center',
            margin: '10px 0 5px'
        },
        '.header-link': {
            width: 'auto',
            display: 'inline-block',
            padding: '10px',
            'font-size': '20px',
            'font-weight': '300',
            'line-height': '40px',
            'box-sizing': 'border-box'
        },
        '.banner': {
            display: 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'align-items': 'center',
            top: '0',
            left: '0',
            position: 'absolute',
            width: '100%',
            'min-height': '480px',
            height: '80vh',
            'max-height': '560px',
            'box-sizing': 'border-box',
            padding: '48px 48px 32px',
            overflow: 'hidden',
            '-webkit-transform': 'skewY(5deg)',
            transform: 'skewY(5deg)',
            '-webkit-transform-origin': '100%',
            'transform-origin': '100%',
            'background-color': '#34495e',
            color: '#fff'
        },
        '.banner-text': {
            color: '#FFF',
            'font-size': '1.8em',
            display: 'flex',
            position: 'relative',
            'align-items': 'center',
            'flex-direction': 'column',
            'justify-content': 'center',
            'text-transform': 'uppercase',
            'text-align': 'center',
            'padding': '10px'
        },
        '.banner-img': {
            display: 'flex',
            position: 'relative',
            'flex-direction': 'column',
            'justify-content': 'center',
            'align-items': 'center'
        },
        '.main-title': {
            color: '#0984e3',
            'text-transform': 'uppercase',
            'font-size': '1.5em'
        },
        '.main-text': {
            margin: '20px 0'
        },
        '.footer-block': {
            margin: '0 40px 40px 0'
        },
        '.footer-block h1': {
            'text-transform': 'uppercase',
            'font-size': '1em'
        },
        '.footer-block a': {
            'font-weight': '100',
            'font-size': '.9em',
            'text-decoration': 'none',
            color: '#FFF'
        },
        '.ovr-link': {
            color: '#000',
            'text-decoration': 'none',
            cursor: 'pointer'
        },
        '.ovr-link:hover': {
            'text-decoration': 'underline'
        },
        '.heading-link': {
            color: '#999',
            'margin-left': '5px'
        },
        '.heading-link:hover': {
            color: '#333'
        },
        '.suggest-link': {
            color: '#3498db',
            'font-size': '20px',
            float: 'right',
            'margin-right': '5px'
        },
        '.suggest-link:hover': {
            color: '#666',
            background: 'whitesmoke'
        },
        '.api-heading': {
            'font-size': '2em',
            'line-height': '110%',
            'margin': '8px 0',
            'display': 'inline-block'
        },
        '.api-type': {
            padding: '5px',
            color: '#fff',
            'border-radius': '4px',
            'margin-left': '20px',
            'text-transform': 'uppercase'
        },
        '.api-type.module': {
            background: '#9b59b6'
        },
        '.api-type.typedef': {
            background: '#3498db'
        },
        '.api-type.class': {
            background: '#2ecc71'
        },
        '.api-body .desc': {
            margin: '16px 0 0 10px'
        },
        '.method-table': {
            width: '100%',
            'margin-top': '20px',
            '-webkit-box-shadow': '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)',
            'box-shadow': '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)'
        },
        'table thead>tr>th': {
            padding: '10px',
            background: '#f6f8fa',
            'border-bottom': '1px solid #dbdbdb',
            'font-size': '1.2em',
            'text-align': 'left'
        },
        'td.desc': {
            padding: '10px'
        },
        '.desc>p': {
            'margin-top': '5px'
        },
        'hr.rows': {
            border: '.5px solid gainsboro',
            margin: '50px'
        },
        'code': {
            'font-size': '85%',
            'line-height': '1.45',
            'font-family': 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace'
        },
        'pre.source': {
            'margin-top': '10px',
            'background-color': '#f6f8fa',
            'border-radius': '3px',
            'font-size': '85%',
            'line-height': '1.45',
            overflow: 'auto',
            padding: '16px',
            'font-family': 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace'
        },
        'pre>b': {
            color: '#0984e3'
        },
        'pre>i': {
            color: '#e67e22'
        },
        '.sig .source': {
            background: '#FFF',
            'margin-top': '0'
        },
        '.status-title': {
            'font-size': '3.5em',
            'font-weight': '800',
            margin: '1em 0 .5em 0',
            color: '#666'
        },
        '.status-description': {
            'font-size': '2em',
            margin: '0 0 1em',
            color: '#666'
        },
        '.status-code': {
            'font-size': '1.2em',
            'font-weight': '500',
            color: '#666'
        }
    }));

    // Setup the app.
    backbrace.settings({
        windowMode: false,
        app: {
            title: 'Backbrace Docs'
        },
        style: {
            images: {
                logo: '/images/logo-landscape.png',
                blocker: '/images/logo-portrait-dark.png'
            },
            colors: {
                primary: '#34495e',
                background: '#FFF'
            }
        }
    });

    // Setup dev mode.
    if (backbrace.globals.DEVMODE) {
        backbrace.settings({
            minify: false,
            debug: true,
            packages: '/dist',
            style: {
                font: {
                    url: '/dist/roboto/css/roboto/roboto-fontface.css'
                }
            }
        });
    }

    // Register the service worker.
    if ('serviceWorker' in window.navigator)
        window.navigator.serviceWorker.register('/service-worker.js' + (backbrace.settings().debug ? '?debug=true' : ''))
            .then(function(reg) {
                backbrace.serviceWorker(reg);
            });

    // Setup routes.
    backbrace.route(
        { path: '/', page: 'page/guide' },
        { path: ':name', page: 'page/guide' },
        { path: ':parent/:name', page: 'page/guide' },
        { path: 'api', page: 'page/apihome' },
        { path: 'api/:module', page: 'page/api' }
    );

    backbrace.ready(function() {

        var $ = backbrace.jquery();

        $('.navbar-inner').removeClass('z-depth-1');

        $('.navbar-brand').attr('route', '/');

        //$('<div class="header-link"><a route="api">API</a></div>')
        //   .appendTo($('.navbar-inner'));

    });

    // Start the app!
    backbrace.start();

})(backbrace.window(), backbrace.jquery());
