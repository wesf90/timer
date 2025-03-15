// Basic service worker for PWA functionality
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('timer-pwa-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/timer.js',
                '/beep.mp3' // Add your beep sound file here
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
