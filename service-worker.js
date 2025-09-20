const CACHE_NAME = "evento-musical-v1";
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
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
});

// Fetch con caché primero
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
