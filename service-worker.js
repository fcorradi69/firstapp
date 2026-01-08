const CACHE_NAME = 'simple-pwa-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'app.js',
  'service-worker.js',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png'
];

// Install: cache dei file base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate: pulizia cache vecchie (qui semplice)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => { 
          if (key !== CACHE_NAME) 
          { 
            return caches.delete(key); 
          } 
        }) 
      ) 
    ) 
  );
  //event.waitUntil(self.clients.claim());
});

// Fetch: strategia cache-first (se manca rete, serve cache) 
self.addEventListener('fetch', (event) => { 
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se trovo nella cache, uso quello
      if (cachedResponse)
      {
        return cachedResponse;
      }
      
      // Altrimenti provo rete e (se va) metto in cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Non cachiamo richieste non valide
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic')
          {
            return networkResponse;
          }
          
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        })
        .catch(() => {
          // Se anche la rete fallisce e non ho cache, potresti:
          // - restituire una pagina offline personalizzata
          // Per ora non restituiamo niente di speciale.
        });
    })
  );
});

// Fetch: rispondi dalla cache se possibile, altrimenti vai in rete
//self.addEventListener('fetch', event => {
//  event.respondWith(
//    caches.match(event.request).then(cachedResponse => {
//      return cachedResponse || fetch(event.request);
//    })
//  );
//});
