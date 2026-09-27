const CACHE_NAME = 'studio-workspace-v5';
const ASSETS = [
  '.',
  'index.html',
  'manifest.json',
  'https://cloudflare.com',
  'https://cloudflare.com',
  'https://jsdelivr.net',
  'https://unpkg.com',
  'https://unpkg.com'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Allow live external video streams to bypass the cache entirely
  if (e.request.url.includes('video') || e.request.url.endsWith('.mp4') || e.request.url.endsWith('.mov')) {
    return fetch(e.request);
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
