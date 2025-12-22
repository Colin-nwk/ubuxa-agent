
const CACHE_NAME = 'ubuxa-portal-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event with Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Handle cross-origin requests for ESM modules and Fonts
  const isExternal = event.request.url.startsWith('http');
  
  if (isExternal || event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
                return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }).catch(() => {
              // Network failed
              return cachedResponse;
          });

          // Return cached response immediately if available (Stale), otherwise wait for network
          return cachedResponse || fetchPromise;
        })
      );
  }
});

// Sync Event for Background Sync (if supported)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sales') {
        console.log('Background sync triggered');
        // Logic to process indexedDB queue would go here in a full backend implementation
    }
});
