const CACHE_NAME = 'evento-musical-4.0.1'; // Cambia versión al actualizar la PWA
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/canciones.txt',
  '/libros.txt',
  '/peliculas.txt',
  // añade CSS, JS y otros archivos esenciales
];

// Instalación y precacheo
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker y precacheando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting()) // Activar inmediatamente
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    ).then(() => self.clients.claim()) // Tomar control inmediato
  );
});

// Interceptar fetch
self.addEventListener('fetch', event => {
  const request = event.request;

  // Network-first para HTML
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first para otros recursos
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        }
        return response;
      }).catch(() => null);
    })
  );
});

// Forzar actualización de clientes cuando hay nuevo SW
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
