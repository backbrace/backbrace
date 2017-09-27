'use strict';

var loaderHelper = (function() {

    var progressbar,
        progressbarbg,
        progressblocker,
        inProgress = false,
        fadingOut = false;

    function styleCSS() {

        progressbar.setAttribute('style', 'display: block;');
        progressbar.setAttribute('style', 'z-index:' + $app.settings.loader.zIndex + ';');
        progressbar.style.position = 'fixed';
        progressbar.style.width = $app.settings.loader.barWidth + 'px';
        progressbar.style.left = -$app.settings.loader.barWidth + 'px';
        progressbar.style.top = '0px';
        progressbar.style.background = $app.settings.colors.progress;
        progressbar.style.height = $app.settings.loader.height + 'px';

        progressbarbg.style.backgroundColor = $app.settings.colors.progressBG;
        progressbarbg.style.width = '100%';
        progressbarbg.style.height = $app.settings.loader.height + 'px';
        progressbarbg.style.position = 'fixed';
        progressbarbg.style.top = '0px';
        progressbarbg.style.left = '0px';

        var height = $window.innerHeight || $window.document.documentElement.clientHeight ||
            $window.document.body.clientHeight;
        progressblocker.style.backgroundColor = $app.settings.colors.blockerBG;
        progressblocker.style.width = '100%';
        progressblocker.style.height = height + 'px';
        progressblocker.style.position = 'fixed';
        progressblocker.style.top = '0px';
        progressblocker.style.left = '0px';
        progressblocker.style.zIndex = '50000';
        progressblocker.style.background = $app.settings.colors.blockerBG +
            ' url(' + $app.settings.images.blocker + ') no-repeat center center fixed';
    }

    function animate() {

        var id = $window.setInterval(frame, $app.settings.loader.intervalAnmation);
        var width = $window.innerWidth || $window.document.documentElement.clientWidth ||
            $window.document.body.clientWidth;
        var fromLeft = -$app.settings.loader.barWidth;
        function frame() {
            if (inProgress) {
                if (fromLeft > $app.settings.loader.barWidth + width) {
                    progressbar.style.left = -$app.settings.loader.barWidth + 'px';
                    fromLeft = -$app.settings.loader.barWidth;
                } else {
                    fromLeft += 10;
                    progressbar.style.left = fromLeft + 'px';
                }
            } else {
                $window.clearInterval(id);
            }
        }
    }

    function start() {

        if (!fadingOut) {
            inProgress = true;
            progressblocker.style.opacity = 1;
            animate();
        } else {
            $window.setTimeout(function() {
                start();
            }, 200);
        }
    }

    function stop() {

        if (inProgress) {
            fadeOut();
            inProgress = false;
        }
    }

    function fadeOut() {

        var op = 1;
        fadingOut = true;
        var timer = $window.setInterval(function() {
            if (op <= 0.1) {
                progressblocker.style.opacity = 0;
                $window.clearInterval(timer);
                fadingOut = false;
                var element = $window.document.getElementsByClassName('progressbarblocker');
                if (element.length > 0)
                    element[0].outerHTML = '';
            } else {
                progressblocker.style.opacity = op;
                progressblocker.style.filter = 'alpha(opacity=' + (op * 100) + ')';
                op -= op * 0.1;
            }
        }, 10);
    }

    return {

        show: function() {

            if (inProgress)
                return;

            // Add the elements.
            progressblocker = $js.addElement('div', { 'class': 'progressbarblocker' },
                $window.document.body);
            progressbarbg = $js.addElement('div', { 'class': 'progressbarbg' },
                progressblocker);
            progressbar = $js.addElement('div', { 'class': 'progressbar' },
                progressblocker);

            // Style the elements.
            styleCSS();

            // Start the animation.
            start();
        },

        hide: function() {

            // Stop the animation.
            stop();
        }

    };

})();
