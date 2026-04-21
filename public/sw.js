const CACHE_NAME = 'tawzii-v3';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

/** Only http/https URLs can be stored in the Cache API */
function isCacheableUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

/** Safely put a response into cache — swallows unsupported-scheme errors */
function safeCachePut(cache, request, response) {
  try {
    if (!isCacheableUrl(request.url)) return;
    cache.put(request, response).catch(() => {});
  } catch (_) {
    // Silently ignore — e.g. chrome-extension:// scheme
  }
}

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
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip non-http(s) schemes — chrome-extension://, moz-extension://, etc.
  if (!isCacheableUrl(request.url)) return;

  // Skip API requests
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          const shouldCache =
            response.ok &&
            isCacheableUrl(request.url) &&
            (request.mode === 'navigate' ||
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'image');

          if (shouldCache) {
            // Clone BEFORE returning — body can only be consumed once
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              safeCachePut(cache, request, cloned)
            );
          }
          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return undefined;
        });

      return cached || fetched;
    })
  );
});

/** Listen for message from app to force SW update */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
