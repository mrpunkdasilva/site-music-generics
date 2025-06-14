/**
 * The Generics - Service Worker
 * 
 * This service worker handles caching and offline functionality
 * for the PWA version of the site.
 */

// Cache name - update version when making significant changes
const CACHE_NAME = 'the-generics-cache-v1';

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/about.html',
  '/store.html',
  '/gallery.html',
  '/offline.html',
  '/css/modern-style.css',
  '/css/theme.css',
  '/css/gallery.css',
  '/js/app.js',
  '/js/modules/theme-switcher.js',
  '/js/modules/pwa-handler.js',
  '/js/modules/image-handler.js',
  '/js/modules/accessibility.js',
  '/js/modules/gallery.js',
  '/img/favicon.svg',
  '/img/favicon.png',
  '/img/Band Members.png',
  '/img/Youtube Logo.png',
  '/img/Spotify Logo.png',
  '/img/Facebook Logo.png',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-144x144.png',
  '/img/icons/icon-152x152.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-384x384.png',
  '/img/icons/icon-512x512.png',
  '/img/icons/maskable-icon.png'
];

// Install event - cache precache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .catch(error => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Claim clients to ensure the service worker controls all clients immediately
  event.waitUntil(self.clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For HTML pages, use network-first strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If not in cache, serve the offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For other resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // If in cache, serve from cache
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache the response
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // For image requests, return a fallback image
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/img/fallback-image.png');
            }
            
            // For other requests, just propagate the error
            throw error;
          });
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {
    title: 'The Generics',
    body: 'Novidades da banda!',
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/icon-96x96.png',
    data: {
      url: '/'
    }
  };
  
  // Try to parse the payload if available
  if (event.data) {
    try {
      notificationData = Object.assign(notificationData, JSON.parse(event.data.text()));
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: [100, 50, 100],
      data: notificationData.data
    })
  );
});

// Notification click event - handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received:', event);
  
  event.notification.close();
  
  // Get the URL to open from the notification data
  const urlToOpen = event.notification.data && event.notification.data.url
    ? new URL(event.notification.data.url, self.location.origin).href
    : self.location.origin;
  
  // Open the URL in a new window/tab
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there's already a window/tab open with the target URL
        const matchingClient = windowClients.find(client => {
          return client.url === urlToOpen;
        });
        
        // If so, focus it
        if (matchingClient) {
          return matchingClient.focus();
        }
        
        // If not, open a new window/tab
        return clients.openWindow(urlToOpen);
      })
  );
});