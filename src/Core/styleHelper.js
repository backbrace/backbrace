'use strict';

/**
 * Application style helper.
 * @module core
 */
var styleHelper = (function() {

    function mergeSettings(val) {

        $js.forEach($app.settings.colors, function(item, key) {
            if (val.indexOf('%colors:' + key + '%') !== -1)
                val = val.replace('%colors:' + key + '%', item);
        });

        $js.forEach($app.settings.font, function(item, key) {
            if (val.indexOf('%font:' + key + '%') !== -1)
                val = val.replace('%font:' + key + '%', item);
        });

        $js.forEach($app.settings.images, function(item, key) {
            if (val.indexOf('%images:' + key + '%') !== -1)
                val = val.replace('%images:' + key + '%', item);
        });

        return val;
    }

    return {

        load: function(obj) {

            // Create style tag.
            var style = $('<style>');

            // Loop through css classes.
            $js.forEach(obj, function(cls, className) {

                var css = className + '{';
                var othercss = '';

                // Loop through styles in the class.
                $js.forEach(cls, function(style, styleName) {

                    // Check for a multi style.
                    if (Array.isArray(style)) {
                        $js.forEach(style, function(multistyle, msName) {
                            css += styleName + ': ' + mergeSettings(multistyle) + ';';
                        });
                    } else if (styleName.indexOf && styleName.indexOf('@media') === 0) {
                        othercss += styleName + '{' + className + '{';
                        $js.forEach(style, function(otherstyle, osName) {
                            othercss += osName + ': ' + mergeSettings(otherstyle) + ';';
                        });
                        othercss += '}}';
                    } else {
                        css += styleName + ': ' + mergeSettings(style) + ';';
                    }
                });

                css += '}' + othercss;
                style.append(css);
            });

            // Add the style tag to head.
            style.appendTo($('head'));
        }
    };

})();
