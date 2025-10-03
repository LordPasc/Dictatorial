const CACHE_NAME = "evento-musical-v3"; // Cambia la versión en cada actualización
const URLS_TO_CACHE = [
  "index.html",
  "styles.css",
  "script.js",
  "canciones.txt",
  "libros.txt",
  "peliculas.txt",
  "consentimiento.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// Instalación
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Fuerza que este SW se active inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Activación
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Fuerza que los clientes actuales usen el nuevo SW
});

// Fetch con caché actualizado dinámicamente
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Actualiza caché con la respuesta más reciente
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
