// Updated Service Worker to clear old caches and prevent white screen

self.addEventListener('install', event => {
    // Force the new service worker to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    // Delete all old caches to prevent stale index.html loading breaking chunk JS files
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Network-first strategy to always fetch the freshest index.html and JS chunks
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
