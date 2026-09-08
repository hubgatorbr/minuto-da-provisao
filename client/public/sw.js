const CACHE = 'minuto-da-provisao-v4';
const APP_SHELL = ['/manifest.json', '/icon.svg'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // tRPC and OAuth always reach the live server.
  if (url.pathname.startsWith('/api/')) return;

  // Vite development modules are regenerated in place and must not be cached.
  const isDevModule =
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@fs/') ||
    url.pathname.startsWith('/@vite/');
  if (isDevModule) {
    event.respondWith(fetch(request));
    return;
  }

  // Documents are network-first so route changes are available immediately.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && url.origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
