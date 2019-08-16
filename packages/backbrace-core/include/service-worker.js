var CACHE_NAME = 'backbrace-FULLVERSION';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Installed cache');
                return cache.addAll([
                    '/'
                ]);
            }).then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {

    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return cacheNames.map(function(cacheName) {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
                return null;
            });
        }).then(function() {
            console.log('Removed old cache');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                var skip = false;
                if (self.location.search.toLowerCase().indexOf('debug=true') !== -1)
                    skip = true;
                // Cache hit - return response
                if (response && !skip && response.ok) {
                    return response;
                }
                return fetch(event.request).then(function(response) {
                    if (event.request.method === 'GET' && response.ok)
                        cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
