/// <reference lib="webworker" />

const CACHE_NAME = 'tawzii-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method !== 'GET') return;

  // Skip API requests — those are handled by offline queue
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          // Cache successful navigation and static asset responses
          if (response.ok && (request.mode === 'navigate' || request.destination === 'style' || request.destination === 'script' || request.destination === 'image')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Network failed — if navigating, return cached root
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return undefined;
        });

      // Return cached version immediately, update in background (stale-while-revalidate)
      return cached || fetched;
    })
  );
});
