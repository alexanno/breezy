const CACHE_NAME = 'breezy-static-v3';
const TILE_CACHE = 'breezy-tiles-v1';
const BASE_URL = self.registration.scope;
const OFFLINE_FALLBACK = `${BASE_URL}index.html`;
const PRECACHE_ASSETS = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}manifest.webmanifest`,
  `${BASE_URL}service-worker.js`,
  `${BASE_URL}icons/icon-128.png`,
  `${BASE_URL}icons/icon-192.png`,
  `${BASE_URL}icons/icon-512.png`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('breezy-') && key !== CACHE_NAME && key !== TILE_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => caches.match(OFFLINE_FALLBACK))
    );
    return;
  }

  // Cache map tiles with stale-while-revalidate for snappier panning offline-ish
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // App shell cache-first, then network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(response => {
          const clone = response.clone();
          if (response.ok && response.type === 'basic') {
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(OFFLINE_FALLBACK));
    })
  );
});
