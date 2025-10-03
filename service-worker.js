// Nombre y versión del caché
const CACHE_NAME = 'evento-musical-v1'; // Cambia "v1" cada vez que actualices tu PWA
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/canciones.txt',
  '/libros.txt',
  '/peliculas.txt',
  // añade aquí todos los recursos esenciales, CSS, JS y otros archivos
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker y precacheando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Limpiando caché vieja:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
      .catch(() => {
        // opcional: fallback si no hay conexión
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});
