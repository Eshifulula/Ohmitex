/// <reference lib="webworker" />

const CACHE_NAME = 'ohmitex-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching files');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API and admin routes
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response and update cache in background
                event.waitUntil(
                    fetch(event.request).then((response) => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, response);
                            });
                        }
                    }).catch(() => { })
                );
                return cachedResponse;
            }

            // Try network first
            return fetch(event.request)
                .then((response) => {
                    // Cache successful responses
                    if (response.ok && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {
        title: 'Ohmitex Smart Controls',
        body: 'New update available!',
        icon: '/icons/icon-192x192.png',
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: data.url || '/',
            actions: [
                { action: 'open', title: 'Open' },
                { action: 'dismiss', title: 'Dismiss' },
            ],
        })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
