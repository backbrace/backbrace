'use strict';

/**
 * App service.
 */
var $app = (function() {

    return {

        settings: {

            name: 'jumpstartapp',
            version: '0.1.0',
            title: 'New Jumpstart App',
            style: 'flat',
            debug: false,
            minify: true,
            mobile: false,

            homePage: null,

            loader: {
                intervalAnmation: 10,
                height: 10,
                zIndex: 1000,
                barWidth: 800
            },

            font: {
                url: 'https://fonts.googleapis.com/css?family=Roboto:400,500',
                family: '\'Roboto\', sans-serif'
            },

            images: {
                logo: 'https://cdn.jumpstartjs.org/images/logo-light.png',
                menuLogo: 'https://cdn.jumpstartjs.org/images/logo-dark.png',
                blocker: 'https://cdn.jumpstartjs.org/images/logo-portrait.png',
                iconsURL: 'https://cdn.jumpstartjs.org/images/icons'
            },

            colors: {
                header: '#3498db',
                headertext: '#FFF',
                headerborder: 'none',
                title: '#FFF',
                titletext: '#000',
                progressBG: '#A2CFEE',
                progress: '#3498DB',
                blockerBG: '#ECF0F1',
                menuicon: '#FFF',
                default: '#FFF',
                defaulttext: '#000',
                hover: 'whitesmoke',
                hovertext: '#000',
                alertbutton: '#3498db',
                alertbuttontext: '#FFF'
            }
        },

        schema: {
            tables: {},
            pages: {}
        },

        styles: {
        },

        packages: {

            jQuery: function(version) {
                var min = ($app.settings.minify ? '.min' : '');
                version = version || '2.0.0';
                return 'https://ajax.googleapis.com/ajax/libs/jquery/' + version +
                    '/jquery' + min + '.js';
            },

            jQueryUI: function(version, mversion) {
                var min = ($app.settings.minify ? '.min' : '');
                version = version || '1.10.0';
                mversion = mversion || '1.4.0';
                if ($js.mobile)
                    return [[
                        'https://ajax.googleapis.com/ajax/libs/jquerymobile/' + mversion +
                        '/jquery.mobile' + min + '.js',
                        'https://ajax.googleapis.com/ajax/libs/jquerymobile/' + mversion +
                        '/jquery.mobile.min.css'
                    ]];

                return [[
                    'https://ajax.googleapis.com/ajax/libs/jqueryui/' + version +
                    '/jquery-ui' + min + '.js',
                    'https://ajax.googleapis.com/ajax/libs/jqueryui/' + version +
                    '/themes/smoothness/jquery-ui.css'
                ]];
            }

        },

        /**
         * Get a page.
         * @param {string} name - Name of the page.
         * @returns {Page}
         */
        page: function(name) {

            if (!name || name === '')
                $js.error('Page name is required.');

            if ($app.schema.pages[name])
                return new Page($app.schema.pages[name]);

            //TODO - Get from data source.
            return null;
        },

        /**
         * Get a table.
         * @param {string} name - Name of the table.
         * @returns {Table}
         */
        table: function(name) {

            if (!name || name === '')
                $js.error('Table name is required.');

            if ($app.schema.tables[name])
                return new Table($app.schema.tables[name]);

            //TODO - Get from data source.
            return null;
        },

        /**
         * Start the app.
         * @param {*} Base - Base app component to load.
         * @param {*} settings - Settings for the app.
         */
        start: function(Base, settings) {

            var style = null;

            // Extend the settings.
            $js.extend($app.settings, settings);

            $log.debugMode($app.settings.debug);

            // Add font css.
            $js.addElement('link', {
                'href': $app.settings.font.url,
                'rel': 'stylesheet'
            }, $window.document.head);

            // Add font family to body tag.
            $js.addElement('style', {}, $window.document.head)
                .innerHTML = 'body{font-family: ' + $app.settings.font.family + '}';

            // Make sure we have a base component.
            if (typeof Base === 'undefined')
                $js.error('Base component must be defined');

            // Check app style.
            style = $app.styles[$app.settings.style];
            if (typeof style === 'undefined')
                $js.error('JumpStart style "{0}" does not exist', $app.settings.style);

            // Set mobile mode.
            if ($app.settings.mobile === true ||
                /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
                    .test($window.navigator.userAgent.toLowerCase()))
                $js.mobile = true;

            // Add mobile head tags.
            if ($js.mobile) {

                $js.addElement('meta', {
                    'http-equiv': 'X-UA-Compatible',
                    'content': 'IE=Edge'
                }, $window.document.head);

                $js.addElement('meta', {
                    'name': 'viewport',
                    'content': 'width=device-width, initial-scale=1, maximum-scale=1, ' +
                    'user-scalable=no, minimal-ui'
                }, $window.document.head);

                $js.addElement('meta', {
                    'name': 'apple-mobile-web-app-capable',
                    'content': 'yes'
                }, $window.document.head);

                $js.addElement('meta', {
                    'name': 'mobile-web-app-capable',
                    'content': 'yes'
                }, $window.document.head);
            }

            loaderHelper.show();

            // Update title.
            $window.document.title = $app.settings.title;

            // Check for HTML5.
            if (!$js.html5Check())
                $js.error('This app requires a HTML5 browser. We recommend chrome: ' +
                    '<a href="https://www.google.com/chrome/" target="new">click here</a>');

            // Load JQuery.
            packageHelper.loadScript($app.packages.jQuery($js.mobile ? '2.1.0' :
                '3.2.1'), function() {

                    // JQuery wasn't loaded :(
                    if (typeof jQuery === 'undefined')
                        $js.error('Unable to load the JQuery package');

                    function packageError() {
                        var url = this.src || this.href || '';
                        $js.error('Unable to load ' + url +
                            '<br/><br/><a href="" onclick="$window.location.reload();">' +
                            'Click here to reload</a>');
                    }

                    // Add JQuery UI Package and load.
                    packageHelper.add($app.packages.jQueryUI('1.12.1', '1.4.5'));
                    packageHelper.load(function() {

                        packageHelper.addComponent(Base);
                        packageHelper.load(function() {

                            // Load app style.
                            styleHelper.load(style);

                            // Init the code helper.
                            $code.init();

                            $code.runNext(function() {

                                return $code.block(

                                    function() {
                                        // Load base application component.
                                        var app = new Base();
                                        return app.load($js.mobile ? $('.ui-page') : $('body'));
                                    },

                                    function() {
                                        loaderHelper.hide();
                                    }
                                );
                            });

                        }, packageError);

                    }, packageError);

                }, function() {

                    $js.error('Unable to load the JQuery package');

                });

        }


    };
})();
