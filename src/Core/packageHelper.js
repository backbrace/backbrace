'use strict';

var packageHelper = (function() {

    var packages = [],
        loadedPackages = [],
        loadedComponents = [];

    return {

        add: function(pack) {
            $.each(pack, function(i, urls) {
                $.each(urls || [], function(j, url) {
                    if (loadedPackages.indexOf(url) === -1) {
                        loadedPackages.push(url);
                        packages[i] = packages[i] || [];
                        packages[i].push(url);
                    }
                });
            });
        },

        addComponent: function(comp) {
            var name = comp.toString();
            if (loadedComponents.indexOf(name) !== -1)
                return;
            if (comp.package)
                packageHelper.add(comp.package());
            loadedComponents.push(name);
            if (comp.depends)
                $.each(comp.depends(), function(i, subcomp) {
                    packageHelper.addComponent(subcomp);
                });
        },

        loadScript: function(url, onsuccess, onerror) {

            var script = $window.document.createElement('script');
            script.src = url;
            script.async = true;
            script.onerror = onerror;
            script.onload = onsuccess;

            $window.document.head.appendChild(script);
        },

        loadCSS: function(url, onsuccess, onerror) {

            var css = $window.document.createElement('link');
            css.type = 'text/css';
            css.rel = 'stylesheet';
            css.href = url;
            css.onerror = onerror;
            css.onload = onsuccess;

            $window.document.head.appendChild(css);
        },

        load: function(onsuccess, onerror) {

            var urls = packages.shift(),
                styles = [],
                scripts = [],
                loadedResources = 0;

            onsuccess = onsuccess || $js.noop;

            if (!urls)
                return onsuccess();

            styles = $.grep(urls, function(v) {
                return v.indexOf('.css') !== -1;
            });

            scripts = $.grep(urls, function(v) {
                return v.indexOf('.js') !== -1;
            });

            $.each(scripts, function(i, script) {
                packageHelper.loadScript(script, function() {
                    if (++loadedResources === urls.length)
                        packageHelper.load(onsuccess, onerror);
                }, onerror);
            });

            $.each(styles, function(i, style) {
                packageHelper.loadCSS(style, function() {
                    if (++loadedResources === urls.length)
                        packageHelper.load(onsuccess, onerror);
                }, onerror);
            });
        }

    };

})();
