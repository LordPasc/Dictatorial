self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("evento-musical-v1").then(cache => cache.addAll([
      "/",
      "/index.html",
      "/manifest.json"
      // agrega aquí recursos/dependencias extra si quieres
    ]))
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
