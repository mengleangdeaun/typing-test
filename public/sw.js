// Service Worker for PWA support
const CACHE_NAME = 'sccg-typing-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/favicon.svg',
]

// Install event - cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell')
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid responses for static assets
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Offline fallback: serve from cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached
          // For navigation requests, return the app shell
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
      })
  )
})