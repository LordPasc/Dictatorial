const CACHE_NAME = "evento-musical-v4"; // Cambia la versión en cada actualización
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

// Fetch con estrategia diferenciada
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Para archivos críticos, usar Network First
  if (
    url.includes("index.html") ||
    url.includes("script.js") ||
    url.includes("manifest.json")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para el resto, usar Cache then Network
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => null); // Evitar fallo si la red no responde
        return cachedResponse || fetchPromise;
      });
    })
  );
});
