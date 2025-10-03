// Nombre y versión del caché
const CACHE_NAME = 'evento-musical-2.0.0'; // Cambia la versión cada vez que actualices tu PWA
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

// Instalación del Service Worker y precacheo
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker y precacheando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker y limpieza de cachés antiguos
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

// Intercepta solicitudes para servir contenido actualizado
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(cachedResponse => cachedResponse || caches.match('/index.html')))
  );
});
